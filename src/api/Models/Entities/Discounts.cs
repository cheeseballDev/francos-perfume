using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("discounts")]
    public class Discounts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int discount_id { get; set; }
        public required string discount_name { get; set; }
        public decimal discount_percent { get; set; } = 0;
        public decimal discount_amount { get; set; } = 0;
        public required string discount_status { get; set; }
        public required string discount_prefix { get; set; }
        public DateTime discount_created { get; set; } = DateTime.UtcNow;
    }
}
