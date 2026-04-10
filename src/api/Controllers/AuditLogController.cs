using InventorySystemBackend.Data;
using InventorySystemBackend.DTOs;
using InventorySystemBackend.Models.Entities;
using InventorySystemBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace InventorySystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly DatabaseContext dbContext;
        public AuditLogController(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("displayAll")]
        public async Task<IActionResult> DisplayEmployees()
        {
            var claims = new ClaimsGetter(User);
            var role = claims.role;
            var branchDisplayId = claims.GetBranchDisplayId(User);

            if (role != "admin")
            {
                var branchAuditLogs = await dbContext.AuditLogs
                    .Where(i => i.branch_display_id == branchDisplayId)
                    .ToListAsync();

                return Ok(branchAuditLogs);
            }

            var allAuditLogs = await dbContext.AuditLogs.ToListAsync();
            return Ok(allAuditLogs);
        }
    }
}