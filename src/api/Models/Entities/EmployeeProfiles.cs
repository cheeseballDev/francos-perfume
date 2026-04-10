using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("employeeprofiletable")]
    public class EmployeeProfiles
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int employee_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]

        public string? employee_display_id { get; set; }

        public int branch_id { get; set; }
        public string? branch_display_id { get; set; }

        public required string employee_full_name { get; set; }

        public required string contact_number { get; set; }
        public required string address { get; set; }

        public required string employee_shift { get; set; }

        public DateTime account_created { get; set; } = DateTime.UtcNow;
        public required string employee_profile_picture {  get; set; }

        public ICollection<EmployeeAuths> AuthMethods { get; set; } = new List<EmployeeAuths>();
    }
}