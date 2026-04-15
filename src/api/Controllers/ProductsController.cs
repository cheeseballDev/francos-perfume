using InventorySystemBackend.Data;
using InventorySystemBackend.DTOs;
using InventorySystemBackend.Models.Entities;
using InventorySystemBackend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventorySystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DatabaseContext dbContext;

        public ProductsController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("displayAll")]
        public IActionResult DisplayProducts()
        {
            var allProducts = dbContext.Products.ToList();
            return Ok(allProducts);
        }

        [HttpGet("displayOne/{id}")]
        public IActionResult DisplayProductByID(int id)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.product_id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddProducts(AddProductDTO dto)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var claims = new ClaimsGetter(User);
                var role = claims.role;
                var user = claims.employeeDisplayId;
                var userBranch = claims.GetBranchDisplayId(User);

                var products = new Products
                {
                    product_name = dto.product_name,
                    product_type = dto.product_type,
                    product_note = dto.product_note,
                    product_gender = dto.product_gender,
                    product_barcode = dto.product_barcode,
                    product_date_created = DateTime.UtcNow,
                    product_status = "active",
                    product_description = dto.product_description,
                    product_price = dto.product_price,
                    product_image_url = dto.product_image_url
                };

                dbContext.Products.Add(products);
                await dbContext.SaveChangesAsync();

                var audit = new AuditLogs
                {
                    employee_display_id = user,
                    branch_display_id = userBranch,
                    log_action = $"Added product ({products.product_display_id})",
                    log_module = "Product Management",
                    log_timestamp = DateTime.UtcNow
                };
                dbContext.AuditLogs.Add(audit);
                await dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    products.product_id,
                    products.product_display_id
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPut("updateProduct/{id:int}")]
        public async Task<IActionResult> UpdateEmployeeProfile(int id, UpdateProductDTO dto)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var claims = new ClaimsGetter(User);
                var role = claims.role;
                var user = claims.employeeDisplayId;
                var userBranch = claims.GetBranchDisplayId(User);
                var products = await dbContext.Products.FindAsync(id);

                if (products == null)
                    return NotFound();

                products.product_name = dto.product_name;
                products.product_type = dto.product_type;
                products.product_note = dto.product_note;
                products.product_gender = dto.product_gender;
                products.product_barcode = dto.product_barcode;
                products.product_description = dto.product_description;
                products.product_price = dto.product_price;
                products.product_image_url = dto.product_image_url;

                await dbContext.SaveChangesAsync();

                var audit = new AuditLogs
                {
                    employee_display_id = user,
                    branch_display_id = userBranch,
                    log_action = $"Updated product ({products.product_display_id})",
                    log_module = "Product Management",
                    log_timestamp = DateTime.UtcNow
                };
                dbContext.AuditLogs.Add(audit);
                await dbContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    products.product_display_id,
                    products.product_name,
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
