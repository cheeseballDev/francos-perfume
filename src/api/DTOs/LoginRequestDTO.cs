namespace InventorySystemBackend.DTOs
{
    public class LoginRequestDTO
    {
        public string? email { get; set; }
        public string? password { get; set; }
        public string? newPassword { get; set; }
    }
}
