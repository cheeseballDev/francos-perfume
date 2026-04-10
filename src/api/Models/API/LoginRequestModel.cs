namespace InventorySystemBackend.Models.API
{
    public class LoginRequestModel
    {
        public string? email { get; set; }
        public string? password { get; set; }
        public string? newPassword { get; set; }
    }
}
