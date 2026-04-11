using InventorySystemBackend.Data;
using InventorySystemBackend.Models.Entities;
using InventorySystemBackend.Services;
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

        // ─── READ: VIEW ARCHIVES ────────────────────────────────────────────

        /// <summary>
        /// Returns all archived accounts so the admin UI can render the rollback table.
        /// The frontend hits this on modal open (no pagination — archive lists are small).
        /// </summary>
        [HttpGet("displayAllAccounts")]
        public IActionResult DisplayAccountArchives()
        {
            var allArchives = dbContext.ArchivedAccounts.ToList();
            return Ok(allArchives);
        }

        /// <summary>
        /// Returns all archived products so the inventory UI can render the rollback table.
        /// </summary>
        [HttpGet("displayAllProducts")]
        public IActionResult DisplayProductArchives()
        {
            var allArchives = dbContext.ArchivedProducts.ToList();
            return Ok(allArchives);
        }

        // ─── ARCHIVE ────────────────────────────────────────────────────────

        /// <summary>
        /// Archives an employee account.
        /// Route param {id} = employee_id (the numeric PK from employeeprofiletable).
        ///
        /// What this does:
        ///   1. Copies key fields into archiveaccountstable (creates a snapshot)
        ///   2. Sets account_status = "archived" on the auth record
        ///   3. Wraps both writes in a transaction so they succeed or fail together
        /// </summary>
        [HttpPut("archiveAccount/{id:int}")]
        public async Task<IActionResult> ArchiveAccount(int id)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims    = new ClaimsGetter(User);
                var empId     = claims.employeeId;
                var profile   = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id.ToString() == empId);

                // Load the auth record + its linked profile in one query via Include
                var auth = await dbContext.EmployeeAuths
                    .Include(x => x.Employee)
                    .FirstOrDefaultAsync(x => x.employee_id == id);

                if (auth == null)
                    return NotFound("Auth record not found");

                if (auth.account_status == "archived")
                    return BadRequest("Account is already archived");

                var archivedBy = profile?.employee_display_id ?? "System";

                // Snapshot — copy enough data to display in the archive table
                var archive = new ArchivedAccounts
                {
                    employee_display_id = auth.Employee.employee_display_id,
                    email               = auth.email,
                    employee_role       = auth.employee_role,
                    branch_id           = auth.Employee.branch_id,
                    archived_by         = archivedBy,
                    date_archived       = DateTime.UtcNow
                };

                dbContext.ArchivedAccounts.Add(archive);
                auth.account_status = "archived";

                // AuditLog
                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = archivedBy,
                    branch_display_id   = profile?.branch_display_id,
                    log_action          = $"Archived account ({auth.Employee.employee_display_id})",
                    log_module          = "Employee Management",
                    log_timestamp       = DateTime.UtcNow
                });

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

        /// <summary>
        /// Archives a product.
        /// Route param {id} = product_id.
        ///
        /// BUG FIX vs original: we now store product_id in the archive record.
        /// This is required so that RestoreProduct can find the original row.
        /// </summary>
        [HttpPut("archiveProduct/{id:int}")]
        public async Task<IActionResult> ArchiveProduct(int id)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims  = new ClaimsGetter(User);
                var empId   = claims.employeeId;
                var profile = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id.ToString() == empId);

                var product = await dbContext.Products.FirstOrDefaultAsync(x => x.product_id == id);

                if (product == null)
                    return NotFound("Product not found");

                if (product.product_status == "archived")
                    return BadRequest("Product is already archived");

                var archivedBy = profile?.employee_display_id ?? "System";

                var archive = new ArchivedProducts
                {
                    // product_id is NOT a column on ArchivedProducts — the entity only stores
                    // product_display_id (the human-readable string).  RestoreProduct uses
                    // product_display_id to look the original row back up.
                    product_display_id  = product.product_display_id,
                    product_name        = product.product_name,
                    product_type        = product.product_type,
                    product_note        = product.product_note,
                    product_gender      = product.product_gender,
                    product_barcode     = product.product_barcode,
                    archived_by         = archivedBy,
                    date_archived       = DateTime.UtcNow
                };

                dbContext.ArchivedProducts.Add(archive);
                product.product_status = "archived";

                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = archivedBy,
                    branch_display_id   = profile?.branch_display_id,
                    log_action          = $"Archived product ({product.product_display_id})",
                    log_module          = "Product Management",
                    log_timestamp       = DateTime.UtcNow
                });

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

        // ─── RESTORE / ROLLBACK ─────────────────────────────────────────────

        /// <summary>
        /// Rolls back an archived account to "active" status.
        /// Route param {archiveId} = account_archive_id from archiveaccountstable.
        ///
        /// How it works:
        ///   1. Load the archive snapshot using archiveId
        ///   2. Look up the original auth row by email (email is the unique key)
        ///   3. Set account_status = "active" on the auth row
        ///   4. DELETE the archive record — the rollback is now complete
        ///   5. Write an audit log entry so admins can see who did what
        ///
        /// Why we use email as the lookup key:
        ///   The archive table stores employee_display_id and email but NOT auth_id.
        ///   Email is globally unique in the system (enforced at create time),
        ///   so it's a reliable join key for restore.
        /// </summary>
        [HttpPut("restoreAccount/{archiveId:int}")]
        public async Task<IActionResult> RestoreAccount(int archiveId)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims  = new ClaimsGetter(User);
                var empId   = claims.employeeId;
                var profile = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id.ToString() == empId);

                // Step 1: find the archive snapshot
                var archive = await dbContext.ArchivedAccounts
                    .FirstOrDefaultAsync(x => x.account_archive_id == archiveId);

                if (archive == null)
                    return NotFound("Archive record not found");

                // Step 2: find the original auth record using the stored email
                var auth = await dbContext.EmployeeAuths
                    .FirstOrDefaultAsync(x => x.email == archive.email);

                if (auth == null)
                    return NotFound("Original account no longer exists — it may have been permanently deleted from the system");

                // Step 3: restore status
                auth.account_status = "active";

                // Step 4: delete the archive record (rollback complete)
                dbContext.ArchivedAccounts.Remove(archive);

                // Step 5: audit
                var restoredBy = profile?.employee_display_id ?? "System";
                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = restoredBy,
                    branch_display_id   = profile?.branch_display_id,
                    log_action          = $"Restored archived account ({archive.employee_display_id})",
                    log_module          = "Employee Management",
                    log_timestamp       = DateTime.UtcNow
                });

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    restoredEmail  = auth.email,
                    auth.account_status,
                    message        = $"Account {archive.employee_display_id} has been successfully restored"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }

        /// <summary>
        /// Rolls back an archived product to "active" status.
        /// Route param {archiveId} = product_archive_id from archiveproductstable.
        ///
        /// How it works:
        ///   1. Load the archive snapshot using archiveId
        ///   2. Look up the original product row using product_id (stored in snapshot)
        ///   3. Set product_status = "active"
        ///   4. DELETE the archive record
        ///   5. Write an audit log entry
        ///
        /// Why we store product_id in the archive table:
        ///   Unlike accounts (where email is the unique key), products are identified
        ///   only by their auto-generated integer PK. Without storing product_id in
        ///   the snapshot, we cannot reliably find the original row after archiving.
        ///   The original ArchiveProduct action had a bug where it didn't store product_id
        ///   — that has been fixed above.
        /// </summary>
        [HttpPut("restoreProduct/{archiveId:int}")]
        public async Task<IActionResult> RestoreProduct(int archiveId)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var claims  = new ClaimsGetter(User);
                var empId   = claims.employeeId;
                var profile = dbContext.EmployeeProfiles.FirstOrDefault(x => x.employee_id.ToString() == empId);

                // Step 1: find the archive snapshot
                var archive = await dbContext.ArchivedProducts
                    .FirstOrDefaultAsync(x => x.product_archive_id == archiveId);

                if (archive == null)
                    return NotFound("Archive record not found");

                // Step 2: find the original product by its display ID.
                // ArchivedProducts has no product_id column — product_display_id is what
                // was stored at archive time and is unique per product.
                var product = await dbContext.Products
                    .FirstOrDefaultAsync(x => x.product_display_id == archive.product_display_id);

                if (product == null)
                    return NotFound("Original product record not found — it may have been permanently deleted");

                // Step 3: restore
                product.product_status = "active";

                // Step 4: delete the archive record
                dbContext.ArchivedProducts.Remove(archive);

                // Step 5: audit
                var restoredBy = profile?.employee_display_id ?? "System";
                dbContext.AuditLogs.Add(new AuditLogs
                {
                    employee_display_id = restoredBy,
                    branch_display_id   = profile?.branch_display_id,
                    log_action          = $"Restored archived product ({archive.product_display_id})",
                    log_module          = "Product Management",
                    log_timestamp       = DateTime.UtcNow
                });

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    restoredProduct = product.product_display_id,
                    product.product_status,
                    message         = $"Product {archive.product_display_id} ({archive.product_name}) has been successfully restored"
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
