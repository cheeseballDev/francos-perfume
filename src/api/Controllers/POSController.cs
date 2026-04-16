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
    public class POSController : ControllerBase
    {
        private readonly DatabaseContext dbContext;

        public POSController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] POSDTO dto)
        {
            if (dto == null || dto.items == null || !dto.items.Any())
                return BadRequest("No items provided");

            if (dto.amount_paid <= 0)
                return BadRequest("Invalid payment amount");

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                var claims = new ClaimsGetter(User);
                int employeeId = Convert.ToInt32(claims.employeeId);
                int branchId = Convert.ToInt32(claims.branchId);

                var productIds = dto.items.Select(i => i.product_id).ToList();

                var products = await dbContext.Products
                    .Where(p => productIds.Contains(p.product_id))
                    .ToDictionaryAsync(p => p.product_id);

                foreach (var item in dto.items)
                {
                    if (!products.ContainsKey(item.product_id))
                        return BadRequest("Product does not exist");
                }

                var inventories = await dbContext.Inventories
                    .Where(i => productIds.Contains(i.product_id) && i.branch_id == branchId)
                    .ToDictionaryAsync(i => i.product_id);

                decimal total = 0;

                var order = new SalesOrder
                {
                    employee_id = employeeId,
                    branch_id = branchId,
                    sales_timestamp = DateTime.UtcNow
                };

                dbContext.SalesOrders.Add(order);
                await dbContext.SaveChangesAsync();

                var orderDetails = new List<SalesOrderDetail>();

                foreach (var item in dto.items)
                {
                    var product = products[item.product_id];

                    if (!inventories.ContainsKey(item.product_id))
                        return BadRequest("Selected item does not exist");

                    var inventory = inventories[item.product_id];

                    if (inventory.product_qty < item.quantity)
                        return BadRequest("Selected item has inefficient stock");

                    inventory.product_qty -= item.quantity;

                    var lineTotal = product.product_price * item.quantity;
                    total += lineTotal;

                    orderDetails.Add(new SalesOrderDetail
                    {
                        sales_order_id = order.sales_order_id,
                        product_id = item.product_id,
                        quantity = item.quantity,
                        unit_price = product.product_price
                    });
                }

                decimal percent = 0;
                decimal fixedAmount = 0;

                var discount = await dbContext.Discounts
                    .FirstOrDefaultAsync(d => d.discount_id == dto.discount_id);

                if (discount != null)
                {
                    percent = discount.discount_percent;
                    fixedAmount = discount.discount_amount;
                }

                if(discount.discount_percent == 0)
                {
                    percent = 1;
                }
                
                if(discount != null && discount.discount_status == "inactive")
                {
                    return BadRequest("Discount is inactive");
                }

                total = Math.Max(0, (total * percent) - fixedAmount);

                if (dto.amount_paid < total)
                    return BadRequest("Amount paid is less than total.");

                order.total_amount = total;

                dbContext.SalesOrderDetails.AddRange(orderDetails);

                var payment = new Payment
                {
                    sales_order_id = order.sales_order_id,
                    payment_method = dto.payment_method,
                    amount_paid = dto.amount_paid,
                    change_amount = dto.amount_paid - total,
                    payment_date = DateTime.UtcNow
                };

                dbContext.Payments.Add(payment);

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    order.sales_order_display_id,
                    payment.payment_display_id,
                    total,
                    payment.amount_paid,
                    payment.change_amount
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
