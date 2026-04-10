using InventorySystemBackend.Data;
using InventorySystemBackend.Models.API;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InventorySystemBackend.Services
{
    public class JwtService
    {
        private readonly DatabaseContext dbContext;
        private readonly IConfiguration iconfig;
        public JwtService(DatabaseContext dbContext, IConfiguration iconfig)
        {
            this.dbContext = dbContext;
            this.iconfig = iconfig;
        }

        public async Task<LoginResponseModel?> Authenticate(LoginRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.password))
                return null;

            var account = await dbContext.EmployeeAuths
                .FirstOrDefaultAsync(x => x.email == request.email);

            if (account == null)
                return null;

            if(account.account_status == "archived")
                return null;

            var hasher = new PasswordHasher<object>();
            var result = hasher.VerifyHashedPassword(null, account.password_hash, request.password);

            if (result == PasswordVerificationResult.Failed)
                return null;

            var employee = await dbContext.EmployeeProfiles
                .FirstOrDefaultAsync(e => e.employee_id == account.employee_id);

            if (employee == null)
                return null;

            if (account.password_status == "temporary")
            {
                if (string.IsNullOrWhiteSpace(request.newPassword))
                {
                    return new LoginResponseModel
                    {
                        email = account.email,
                        accessToken = null,
                        requiresPasswordChange = true
                    };
                }

                account.password_hash = hasher.HashPassword(null, request.newPassword);
                account.password_status = "active";
                await dbContext.SaveChangesAsync();
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, account.email),
                new Claim(ClaimTypes.Role, account.employee_role),
                new Claim("branch_id", employee.branch_id.ToString()),
                new Claim("branch_display_id", employee.branch_display_id),
                new Claim("employee_id", employee.employee_id.ToString()),
                new Claim("employee_display_id", employee.employee_display_id)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(iconfig["JwtConfig:Key"])
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: iconfig["JwtConfig:Issuer"],
                audience: iconfig["JwtConfig:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseModel
            {
                accessToken = tokenString,
                email = account.email,
                role = account.employee_role,
                branch_id = employee.branch_id,
                requiresPasswordChange = false
            };
        }
    }
}
