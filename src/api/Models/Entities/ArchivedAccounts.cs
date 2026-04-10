using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("archiveaccountstable")]
    public class ArchivedAccounts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int account_archive_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]

        public string? account_archive_display_id { get; set; }

        public required string employee_display_id { get; set; }

        public required string email { get; set; }

        public required string employee_role { get; set; }

        public int branch_id{ get; set; }
        public required string archived_by { get; set; }

        public DateTime date_archived { get; set; } = DateTime.UtcNow;

    }
}