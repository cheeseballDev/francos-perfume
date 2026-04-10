using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventorySystemBackend.Models.Entities
{
    [Table("employeeauthenticationtable")]
    public class EmployeeAuths
    {
        [Key]
        public int auth_id { get; set; }

        public int employee_id { get; set; }

        public required string email { get; set; }
        public string? password_hash { get; set; }
        public required string employee_role { get; set; }

        public required string auth_provider { get; set; } = "local";
        public string? provider_id { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;

        [ForeignKey("employee_id")]
        public EmployeeProfiles Employee { get; set; }
        public required string password_status { get; set; }
        public required string account_status { get; set; }


    }
}