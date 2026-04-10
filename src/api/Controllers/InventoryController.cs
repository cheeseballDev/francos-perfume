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
    public class InventoryController : ControllerBase
    {
        private readonly DatabaseContext dbContext;

        public InventoryController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("displayAll")]
        public async Task<IActionResult> DisplayInventory()
        {

            var branch_id = int.Parse(User.Claims
                    .First(c => c.Type == "branch_id").Value);

            var inventory = await dbContext.Inventories
                .Where(i => i.branch_id == branch_id && i.product_qty > 0 && i.Products.product_status == "active")
                .Select(i => new InventoryDisplayDTO
                {
                    ProductId = i.product_id,
                    ProductDisplayId = i.Products.product_display_id,
                    ProductName = i.Products.product_name,
                    ProductType = i.Products.product_type,
                    ProductStatus = i.Products.product_status,
                    Quantity = i.product_qty
                })
                .ToListAsync();

            if (!inventory.Any())
                return NotFound("No inventory found.");

            return Ok(inventory);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddInventory(AddInventoryDTO dto)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try {
                var claims = new ClaimsGetter(User);
                var role = claims.role;
                var user = claims.employeeDisplayId;
                var userBranch = claims.GetBranchDisplayId(User);
                var branch_id = int.Parse(claims.branchId);
                    

                var existingInventory = await dbContext.Inventories
                    .FirstOrDefaultAsync(i =>
                        i.product_id == dto.product_id &&
                        i.branch_id == branch_id);


                var product = await dbContext.Products
                    .FirstOrDefaultAsync(p => p.product_id == dto.product_id);

                if (product == null)
                    return BadRequest("Product not found.");

                if (product.product_status != "active")
                    return BadRequest("Product is arhived.");

                if(dto.product_quantity <= 0)
                    return BadRequest("Product cannot be set to zero or negative.");

                if (existingInventory != null)
                {
                    existingInventory.product_qty += dto.product_quantity;
                }
                else
                {
                    dbContext.Inventories.Add(new Inventory
                    {
                        product_id = dto.product_id,
                        branch_id = branch_id,
                        product_qty = dto.product_quantity
                    });
                }

                await dbContext.SaveChangesAsync();

                var audit = new AuditLogs
                {
                    employee_display_id = user,
                    branch_display_id = userBranch,
                    log_action = $"Added to inventory ({product.product_display_id})",
                    log_module = "Employee Management",
                    log_timestamp = DateTime.UtcNow
                };
                dbContext.AuditLogs.Add(audit);
                await dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok("Inventory updated.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPatch("updateQuantity/{id:int}")]
        public async Task<IActionResult> UpdateQuantity(int id, int qty)
        {
            var inventory = await dbContext.Inventories
                .FirstOrDefaultAsync(i => i.product_id == id);

            if (inventory == null)
                return NotFound();

            int updatedQty = inventory.product_qty + qty;

            if (updatedQty <= 0)
                return BadRequest("Product cannot be set to zero or negative.");

            inventory.product_qty += updatedQty;

            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                inventory.product_id,
                inventory.product_qty
            });
        }
    }
}