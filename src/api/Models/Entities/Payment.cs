using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("payment")]
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int payment_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? payment_display_id { get; set; }
        public int sales_order_id { get; set; }
        public DateTime payment_date { get; set; } = DateTime.UtcNow;
        public decimal amount_paid { get; set; }
        public decimal change_amount { get; set; }
        public required string payment_method { get; set; }
        [ForeignKey("sales_order_id")]
        public virtual SalesOrder Sales { get; set; }
    }
}
