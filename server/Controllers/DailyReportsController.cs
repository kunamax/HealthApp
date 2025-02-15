using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HealthApp.Data;
using HealthApp.Models;
using HealthApp.DTOs;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DailyReportsController : ControllerBase
    {
        private readonly HealthContext _context;

        public DailyReportsController(HealthContext context)
        {
            _context = context;
        }

        // GET: api/dailyreports
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<DailyReportResponseDto>>> GetDailyReports()
        {
            var reports = await _context.DailyReports
                .Select(r => new DailyReportResponseDto
                {
                    DailyReportId = r.DailyReportId,
                    UserId = r.UserId,
                    Water = r.Water,
                    Steps = r.Steps,
                    Sleep = r.Sleep,
                    Energy = r.Energy,
                    Date = r.Date
                })
                .ToListAsync();

            return Ok(reports);
        }

        // GET: api/dailyreports/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<DailyReportResponseDto>>> GetMyDailyReports()
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? 
                             User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            var reports = await _context.DailyReports
                .Where(r => r.UserId == userId)
                .Select(r => new DailyReportResponseDto
                {
                    DailyReportId = r.DailyReportId,
                    UserId = r.UserId,
                    Water = r.Water,
                    Steps = r.Steps,
                    Sleep = r.Sleep,
                    Energy = r.Energy,
                    Date = r.Date
                })
                .OrderByDescending(r => r.Date)
                .ToListAsync();

            return Ok(reports);
        }

        // GET: api/dailyreports/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<DailyReportResponseDto>> GetDailyReport(Guid id)
        {
            var report = await _context.DailyReports.FindAsync(id);

            if (report == null)
            {
                return NotFound($"Daily report with ID {id} not found.");
            }

            var reportResponse = new DailyReportResponseDto
            {
                DailyReportId = report.DailyReportId,
                UserId = report.UserId,
                Water = report.Water,
                Steps = report.Steps,
                Sleep = report.Sleep,
                Energy = report.Energy,
                Date = report.Date
            };

            return Ok(reportResponse);
        }

        // POST: api/dailyreports
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<DailyReportResponseDto>> CreateDailyReport(CreateDailyReportDto createReportDto)
        {   
            var userIdClaim = User.FindFirst("sub")?.Value ?? 
                             User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
            {
                return NotFound(new { message = "User not found." });
            }

            var raport = await _context.DailyReports.AnyAsync(r => r.Date.Day == DateTime.UtcNow.Day && r.Date.Month == DateTime.UtcNow.Month && r.Date.Year == DateTime.UtcNow.Year);
            if (raport)
            {
                return BadRequest(new { message = "Report for today already created." });
            }
            
            var report = new DailyReport
            {
                DailyReportId = Guid.NewGuid(),
                UserId = userId,
                Water = createReportDto.Water,
                Steps = createReportDto.Steps,
                Sleep = createReportDto.Sleep,
                Energy = createReportDto.Energy,
                Date = DateTime.UtcNow
            };

            _context.DailyReports.Add(report);
            await _context.SaveChangesAsync();

            var reportResponse = new DailyReportResponseDto
            {
                DailyReportId = report.DailyReportId,
                UserId = report.UserId,
                Water = report.Water,
                Steps = report.Steps,
                Sleep = report.Sleep,
                Energy = report.Energy,
                Date = report.Date
            };

            return CreatedAtAction(nameof(GetDailyReport), new { id = report.DailyReportId }, reportResponse);
        }

        // PUT: api/dailyreports/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDailyReport(Guid id, CreateDailyReportDto updateReportDto)
        {
            var report = await _context.DailyReports.FindAsync(id);
            if (report == null)
            {
                return NotFound($"Daily report with ID {id} not found.");
            }

            report.Water = updateReportDto.Water;
            report.Steps = updateReportDto.Steps;
            report.Sleep = updateReportDto.Sleep;
            report.Energy = updateReportDto.Energy;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/dailyreports/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDailyReport(Guid id)
        {
            var report = await _context.DailyReports.FindAsync(id);
            if (report == null)
            {
                return NotFound($"Daily report with ID {id} not found.");
            }

            _context.DailyReports.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
