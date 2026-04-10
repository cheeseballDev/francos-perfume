using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("salestable")]
    public class Sales
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int sales_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public required string sales_display_id { get; set; }

        public int employee_id { get; set; }
        public int branch_id { get; set; }

        public decimal sales_total { get; set; }
        public required string sales_payment_method { get; set; }

        public DateTime sales_timestamp { get; set; } = DateTime.UtcNow;
    }
}