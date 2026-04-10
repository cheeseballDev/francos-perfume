using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("productstable")]

    public class Products
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int product_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string? product_display_id { get; set; }

        public required string product_name { get; set; }
        public required string product_type { get; set; }

        public string? product_note { get; set; }
        public string? product_gender { get; set; }

        public DateTime product_date_created { get; set; } = DateTime.UtcNow;
        public required string product_barcode { get; set; }
        public required string product_status { get; set; }
        public string? product_description {  get; set; }
    }
}