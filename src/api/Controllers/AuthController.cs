using InventorySystemBackend.Models.API;
using InventorySystemBackend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventorySystemBackend.Data;

namespace InventorySystemBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService jwtService;
        private readonly DatabaseContext dbContext;
        public AuthController(JwtService jwtService, DatabaseContext dbContext)
        {
            this.jwtService = jwtService;
            this.dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestModel dto)
        {
            var result = await jwtService.Authenticate(dto);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }
    }
}
