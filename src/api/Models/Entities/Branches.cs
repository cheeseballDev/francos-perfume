using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("branchtable")]
    public class Branches
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int branch_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public required string branch_display_id { get; set; }
        public required string branch_location { get; set; }
        public required string branch_status { get; set; }
    }
}