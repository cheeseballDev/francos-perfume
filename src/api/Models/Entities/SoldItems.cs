using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("solditemstable")]
    public class SoldItems
    {
        public int sales_id { get; set; }
        public int product_id { get; set; }

        public int sold_qty { get; set; }
        public decimal sales_price { get; set; }

        [ForeignKey("product_id")]
        public virtual Products Products { get; set; }
        [ForeignKey("sales_id")]
        public virtual Sales Sales { get; set; }
    }
}