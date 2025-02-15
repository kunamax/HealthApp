using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using HealthApp.Data;
using HealthApp.Models;
using HealthApp.DTOs;
using HealthApp.Jwt;
using HealthApp.Configuration;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly HealthContext _context;
        private readonly JwtSettings _jwtSettings;

        public UsersController(HealthContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            if (user.Password != loginDto.Password)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = JwtTokenGenerator.GenerateJwtToken(
                user.UserId.ToString(), 
                user.Email, 
                _jwtSettings.Key,
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                _jwtSettings.ExpiryHours
            );

            var loginResponse = new LoginResponseDto
            {
                Token = token,
                User = new UserResponseDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Age = user.Age,
                    Weight = user.Weight,
                    Lifestyle = user.Lifestyle.ToString()
                }
            };

            return Ok(loginResponse);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetProfile()
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? 
                             User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid token.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userResponse = new UserResponseDto
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Age = user.Age,
                Weight = user.Weight,
                Lifestyle = user.Lifestyle.ToString()
            };

            return Ok(userResponse);
        }

        // POST: api/users (register)
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto createUserDto)
        {
            if (string.IsNullOrWhiteSpace(createUserDto.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            if (string.IsNullOrWhiteSpace(createUserDto.Password))
            {
                return BadRequest(new { message = "Password is required." });
            }

            if (createUserDto.Password.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters long." });
            }

            if (!Enum.TryParse<Lifestyle>(createUserDto.Lifestyle, out var lifestyle))
            {
                return BadRequest(new { message = "Invalid lifestyle value. Allowed values: Sedentary, LightlyActive, ModeratelyActive, VeryActive, ExtraActive." });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == createUserDto.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "User with this email already exists." });
            }

            var user = new User
            {
                UserId = Guid.NewGuid(),
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Email = createUserDto.Email,
                Password = createUserDto.Password,
                Age = createUserDto.Age,
                Weight = createUserDto.Weight,
                Lifestyle = lifestyle
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var userResponse = new UserResponseDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Age = user.Age,
                    Weight = user.Weight,
                    Lifestyle = user.Lifestyle.ToString()
                };

                return CreatedAtAction(nameof(GetProfile), userResponse);
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user." });
            }
        }
    }
}
