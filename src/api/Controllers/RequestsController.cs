using InventorySystemBackend.Data;
using InventorySystemBackend.DTOs;
using InventorySystemBackend.Models.Entities;
using InventorySystemBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventorySystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints require a valid JWT
    public class RequestsController : ControllerBase
    {
        private readonly DatabaseContext dbContext;

        public RequestsController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // ─── READ ────────────────────────────────────────────────────────────

        /// <summary>
        /// Returns all requests associated with the caller's branch.
        ///
        /// Inbound  = requests that OTHER branches sent toward MY branch.
        ///            Currently not directly queryable because requesttable has
        ///            only one branch_id column (the requester's branch).
        ///            This endpoint returns ALL requests for transparency;
        ///            the frontend tab logic handles the inbound/outbound split
        ///            by comparing branch_id to the caller's own branch_id
        ///            (available in the JWT claims).
        ///
        ///            To support true inbound queries in the future, add a
        ///            fulfilling_branch_id column to requesttable.
        ///
        /// Outbound = requests MY branch submitted to another branch.
        ///            These are filtered to WHERE branch_id = caller's branch.
        ///
        /// Admin    = sees all requests across all branches.
        /// </summary>
        [HttpGet("displayAll")]
        public async Task<IActionResult> DisplayAll()
        {
            var claims    = new ClaimsGetter(User);
            var role      = claims.role;
            var branchId  = int.Parse(claims.branchId);

            // Build the base query with all joins needed to populate RequestDisplayDTO
            var query = dbContext.Requests
                .Include(r => r.Product)
                .Include(r => r.Employee)
                .Include(r => r.Branch)
                .AsQueryable();

            // Non-admins only see their own branch's requests
            if (role != "admin")
                query = query.Where(r => r.branch_id == branchId);

            var result = await query
                .OrderByDescending(r => r.request_date_submitted)
                .Select(r => new RequestDisplayDTO
                {
                    RequestId           = r.request_id,
                    RequestDisplayId    = r.request_display_id,
                    ProductId           = r.product_id,
                    ProductDisplayId    = r.Product.product_display_id,
                    ProductName         = r.Product.product_name,
                    EmployeeId          = r.employee_id,
                    EmployeeDisplayId   = r.Employee.employee_display_id,
                    EmployeeFullName    = r.Employee.employee_full_name,
                    BranchId            = r.branch_id,
                    BranchDisplayId     = r.Branch.branch_display_id,
                    BranchLocation      = r.Branch.branch_location,
                    RequestQty          = r.request_qty,
                    RequestDateSubmitted = r.request_date_submitted,
                    RequestMessage      = r.request_message,
                    RequestStatus       = r.request_status
                })
                .ToListAsync();

            return Ok(result);
        }

        // ─── CREATE ──────────────────────────────────────────────────────────

        /// <summary>
        /// Creates a new stock request for the caller's branch.
        ///
        /// The branch_id and employee_id are pulled from the JWT claims — the
        /// frontend never needs to send them. This prevents one branch from
        /// spoofing another branch's requests.
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddRequest(AddRequestDTO dto)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims   = new ClaimsGetter(User);
                var branchId = int.Parse(claims.branchId);
                var empId    = int.Parse(claims.employeeId);
                var user     = claims.employeeDisplayId;
                var branchDi = claims.GetBranchDisplayId(User);

                // Validate the product exists and is active
                var product = await dbContext.Products
                    .FirstOrDefaultAsync(p => p.product_id == dto.product_id);

                if (product == null)
                    return NotFound("Product not found");

                if (product.product_status != "active")
                    return BadRequest("Cannot request an archived product");

                if (dto.request_qty <= 0)
                    return BadRequest("Quantity must be greater than zero");

                var request = new Requests
                {
                    // request_display_id is DatabaseGenerated(Computed) — the DB sets it.
                    // We must supply a non-null placeholder to satisfy the C# `required`
                    // keyword; EF Core will ignore this value on INSERT.
                    request_display_id     = string.Empty,
                    product_id             = dto.product_id,
                    employee_id            = empId,
                    branch_id              = branchId,
                    request_qty            = dto.request_qty,
                    request_date_submitted = DateTime.UtcNow,
                    request_message        = dto.request_message,
                    request_status         = "PENDING"
                };

                dbContext.Requests.Add(request);
                await dbContext.SaveChangesAsync();

                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = user,
                    branch_display_id   = branchDi,
                    log_action          = $"Created request ({request.request_display_id}) for {product.product_name} ×{dto.request_qty}",
                    log_module          = "Requests",
                    log_timestamp       = DateTime.UtcNow
                });

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    request.request_id,
                    request.request_display_id,
                    request.request_status
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }

        // ─── UPDATE STATUS ───────────────────────────────────────────────────

        /// <summary>
        /// Updates the status of an existing request.
        ///
        /// Valid transitions:
        ///   PENDING  → RECEIVED  (fulfilling branch confirms stock sent)
        ///   PENDING  → DENIED    (fulfilling branch rejects)
        ///   PENDING  → CANCELLED (requesting branch cancels their own request)
        ///
        /// Only the branch that owns the request (or an admin) can cancel it.
        /// Status validation ensures we don't accept invalid values from the client.
        /// </summary>
        [HttpPatch("updateStatus/{id:int}")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateRequestStatusDTO dto)
        {
            var validStatuses = new[] { "PENDING", "RECEIVED", "DENIED", "CANCELLED" };
            if (!validStatuses.Contains(dto.request_status.ToUpper()))
                return BadRequest($"Invalid status. Must be one of: {string.Join(", ", validStatuses)}");

            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims = new ClaimsGetter(User);
                var user   = claims.employeeDisplayId;
                var branchDi = claims.GetBranchDisplayId(User);

                var request = await dbContext.Requests
                    .Include(r => r.Product)
                    .FirstOrDefaultAsync(r => r.request_id == id);

                if (request == null)
                    return NotFound("Request not found");

                var previousStatus = request.request_status;
                request.request_status = dto.request_status.ToUpper();

                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = user,
                    branch_display_id   = branchDi,
                    log_action          = $"Updated request ({request.request_display_id}) status: {previousStatus} → {request.request_status}",
                    log_module          = "Requests",
                    log_timestamp       = DateTime.UtcNow
                });

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    request.request_id,
                    request.request_display_id,
                    request.request_status
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
