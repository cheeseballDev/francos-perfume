namespace InventorySystemBackend.DTOs
{
    public class UpdateEmployeeAuthDTO
    {
        public required string email { get; set; }
        public required string password { get; set; }
        public required string employee_role { get; set; }
        public required string password_status { get; set; }
    }
}
