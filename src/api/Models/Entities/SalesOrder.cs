using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("sales_order")]
    public class SalesOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int sales_order_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? sales_order_display_id { get; set; }

        public int employee_id { get; set; }
        public int branch_id { get; set; }

        public decimal total_amount { get; set; }
        public DateTime sales_timestamp { get; set; } = DateTime.UtcNow;
        public virtual ICollection<SalesOrderDetail> Items { get; set; } = new List<SalesOrderDetail>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

        [ForeignKey("employee_id")]
        public EmployeeProfiles Employee { get; set; }
        [ForeignKey("branch_id")]
        public Branches Branch { get; set; }
    }
}