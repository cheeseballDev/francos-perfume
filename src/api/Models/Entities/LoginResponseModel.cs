public class LoginResponseModel
{
    public required string email { get; set; }
    public required string accessToken { get; set; }

    public string? role { get; set; }
    public int branch_id { get; set; }
    public bool requiresPasswordChange { get; set; }
}