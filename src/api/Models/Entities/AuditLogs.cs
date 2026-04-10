using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("auditlogtable")]
    public class AuditLogs
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int log_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? log_display_id { get; set; }

        public string? employee_display_id { get; set; }
        public string? branch_display_id { get; set; }

        public required string log_action { get; set; }
        public required string log_module { get; set; }

        public DateTime log_timestamp { get; set; } = DateTime.UtcNow;
    }
}