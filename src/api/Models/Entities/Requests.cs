using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("requesttable")]
    public class Requests
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int request_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public required string request_display_id { get; set; }

        public int product_id { get; set; }
        public int employee_id { get; set; }
        public int branch_id { get; set; }

        public int request_qty { get; set; }
        public DateTime request_date_submitted { get; set; } = DateTime.UtcNow;

        public string? request_message { get; set; }
        public required string request_status { get; set; }
    }
}