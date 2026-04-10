using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("archiveproductstable")]
    public class ArchivedProducts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int product_archive_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]

        public string? product_archive_display_id { get; set; }

        public required string product_display_id { get; set; }

        public required string product_name { get; set; }

        public required string product_type { get; set; }
            
        public required string product_note { get; set; }

        public required string product_gender { get; set; }

        public required string product_barcode { get; set; }

        public required string archived_by { get; set; }

        public DateTime date_archived { get; set; } = DateTime.UtcNow;
    }
}