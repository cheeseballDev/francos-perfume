using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("inventory")]
    public class Inventory
    {
        public int product_id { get; set; }
        public int branch_id { get; set; }
        public int product_qty { get; set; }

        [ForeignKey("product_id")]
        public virtual Products Products { get; set; }
        [ForeignKey("branch_id")]
        public virtual Branches Branch { get; set; }
    }
}