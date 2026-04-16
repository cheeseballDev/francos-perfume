using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("sales_order_detail")]
    public class SalesOrderDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int sales_order_detail_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? sales_order_detail_display_id { get; set; }
        public int sales_order_id { get; set; }
        public int product_id { get; set; }

        public int quantity { get; set; }
        public decimal unit_price { get; set; }

        [ForeignKey("product_id")]
        public virtual Products Products { get; set; }
        [ForeignKey("sales_order_id")]
        public virtual SalesOrder Sales { get; set; }
    }
}