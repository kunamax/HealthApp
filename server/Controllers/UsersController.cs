using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthApp.Data;
using HealthApp.Models;
using HealthApp.DTOs;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly HealthContext _context;

        public UsersController(HealthContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Age = u.Age,
                    Weight = u.Weight,
                    Lifestyle = u.Lifestyle.ToString()
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
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

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto createUserDto)
        {
            if (!Enum.TryParse<Lifestyle>(createUserDto.Lifestyle, out var lifestyle))
            {
                return BadRequest("Invalid lifestyle value.");
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

                return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userResponse);
            }
            catch (DbUpdateException)
            {
                return Conflict("User with this email already exists.");
            }
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, CreateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            if (!Enum.TryParse<Lifestyle>(updateUserDto.Lifestyle, out var lifestyle))
            {
                return BadRequest("Invalid lifestyle value.");
            }

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;
            user.Age = updateUserDto.Age;
            user.Weight = updateUserDto.Weight;
            user.Lifestyle = lifestyle;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return Conflict("User with this email already exists.");
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
