using System.Security.Claims;

namespace InventorySystemBackend.Services
{
    public class ClaimsGetter
    {
        private readonly ClaimsPrincipal User;

        public ClaimsGetter(ClaimsPrincipal user)
        {
            User = user;
        }

        public string role => User.FindFirst(ClaimTypes.Role)?.Value ?? "Guest";
        public string employeeId => User.FindFirst("employee_id")?.Value ?? "0";

        public string employeeDisplayId => User.FindFirst("employee_display_id")?.Value ?? "EM-000";
        public string branchId => User.FindFirst("branch_id")?.Value ?? "0";

        public string GetBranchDisplayId(ClaimsPrincipal user)
        {
            var role = user.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "admin")
                return "ADMIN";

            return user.FindFirst("branch_display_id")?.Value ?? "";
        }
    }
}