using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using HospitalityApi.Models;
using HospitalityApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IJwtService _jwt;

        public AuthController(AppDbContext db, IJwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResponseDto(token, user.Email, user.FullName, user.Role));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (exists)
            {
                return BadRequest(new { message = "Email is already registered." });
            }

            var validRole = dto.Role is "Admin" or "Staff" or "Patient" ? dto.Role : "Patient";
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = validRole
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return Ok(new AuthResponseDto(token, user.Email, user.FullName, user.Role));
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (email == null) return Unauthorized();

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return NotFound();

            return Ok(new { user.Id, user.FullName, user.Email, user.Role });
        }
    }
}
