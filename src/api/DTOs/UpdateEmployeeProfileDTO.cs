namespace InventorySystemBackend.DTOs
{
    public class UpdateEmployeeProfileDTO
    {
        public int branch_id { get; set; }
        public required string contact_number { get; set; }
        public required string address { get; set; }

        public required string full_name { get; set; }
        public required string employee_role { get; set; }
        public required string employee_shift { get; set; }
        public required string employee_profile_picture { get; set; }

    }
}
