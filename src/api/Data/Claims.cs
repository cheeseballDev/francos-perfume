using System.Security.Claims;

namespace InventorySystemBackend.Data
{
    public static class Claims
    {
        public static string? GetEmployeeId(this ClaimsPrincipal user)
        {
            return user.FindFirst("employee_id")?.Value;
        }
    }
}
