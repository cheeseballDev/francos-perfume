using InventorySystemBackend.Data;
using InventorySystemBackend.DTOs;
using InventorySystemBackend.Models.Entities;
using InventorySystemBackend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventorySystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivingController : ControllerBase
    {
        private readonly DatabaseContext dbContext;
        public ArchivingController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPut("archiveAccount/{id:int}")]
        public async Task<IActionResult> ArchiveAccount(int id)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var claims = new ClaimsGetter(User);
                var employeeId = Convert.ToInt32(claims.employeeDisplayId);
                var profile = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id == employeeId);

                var auth = await dbContext.EmployeeAuths
                    .Include(x => x.Employee)
                    .FirstOrDefaultAsync(x => x.employee_id == id);

                if (auth == null)
                    return NotFound("Auth record not found");

                if (auth.account_status == "archived")
                    return BadRequest("Account is already archived");

                var archivedBy = profile.employee_display_id ?? "Jeffrey Epstein";

                var archive = new ArchivedAccounts
                {
                    employee_display_id = auth.Employee.employee_display_id,
                    email = auth.email,
                    employee_role = auth.employee_role,
                    branch_id = auth.Employee.branch_id,
                    archived_by = archivedBy,
                    date_archived = DateTime.UtcNow
                };
                dbContext.ArchivedAccounts.Add(archive);

                auth.account_status = "archived";

                var audit = new AuditLogs
                {
                    employee_display_id = profile.employee_display_id,
                    branch_display_id = profile.branch_display_id,
                    log_action = $"Archived account ({auth.Employee.employee_display_id})",
                    log_module = "Employee Management",
                    log_timestamp = DateTime.UtcNow
                };
                dbContext.AuditLogs.Add(audit);

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    archive.account_archive_id,
                    archive.account_archive_display_id,
                    auth.employee_id,
                    auth.account_status
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPut("archiveProduct/{id:int}")]
        public async Task<IActionResult> ArchiveProduct(int id)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var claims = new ClaimsGetter(User);
                var employeeId = Convert.ToInt32(claims.employeeDisplayId);
                var profile = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id == employeeId);

                var product = await dbContext.Products
                    .FirstOrDefaultAsync(x => x.product_id == id);

                if (product == null)
                    return NotFound("Product not found");

                if (product.product_status == "archived")
                    return BadRequest("Product is already archived");

                var archivedBy = profile.employee_display_id ?? "Jeffrey Epstein";

                var archive = new ArchivedProducts
                {
                    product_display_id = product.product_display_id,
                    product_name = product.product_name,
                    product_type = product.product_type,
                    product_note = product.product_note,
                    product_gender = product.product_gender,
                    product_barcode = product.product_barcode,
                    archived_by = archivedBy,
                    date_archived = DateTime.UtcNow
                };
                dbContext.ArchivedProducts.Add(archive);

                product.product_status = "archived";

                var audit = new AuditLogs
                {
                    employee_display_id = profile.employee_display_id,
                    branch_display_id = profile.branch_display_id,
                    log_action = $"Archived product ({product.product_display_id})",
                    log_module = "Product Management",
                    log_timestamp = DateTime.UtcNow
                };
                dbContext.AuditLogs.Add(audit);

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    archive.product_archive_id,
                    archive.product_archive_display_id,
                    product.product_id,
                    product.product_status
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
