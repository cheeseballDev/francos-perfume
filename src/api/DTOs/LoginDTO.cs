namespace InventorySystemBackend.DTOs
{
    public class LoginDTO
    {
        public string email { get; set; } = null!;
        public string password { get; set; } = null!;
        public string? newPassword { get; set; } = null!;
    }
}
