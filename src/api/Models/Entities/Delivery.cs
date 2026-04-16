using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("delivery")]
    public class Delivery
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int delivery_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? delivery_display_id { get; set; }

        public int product_id { get; set; }
        public int branch_id { get; set; }

        public string? movement_type { get; set; }
        public int quantity { get; set; }

        public string? reference_id { get; set; }
        public string? note { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;
        [ForeignKey("product_id")]
        public virtual Products Products { get; set; }
        [ForeignKey("branch_id")]
        public virtual Branches Branches { get; set; }
    }
}
