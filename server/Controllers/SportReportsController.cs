using System.Collections;
using HealthApp.Data;
using HealthApp.DTOs;
using HealthApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SportReportsController : ControllerBase
    {
        private readonly HealthContext _context;

        public SportReportsController(HealthContext context)
        {
            _context = context;
        }

        // GET: api/sportreports/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SportReportResponseDto>>> GetMySportReports()
        {
            var userIdClaim = User.FindFirst("sub")?.Value ??
                                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            var reports = await _context.SportReports
                .Select(s => new SportReportResponseDto
                {
                    SportReportId = s.SportReportId,
                    UserId = s.UserId,
                    ActivityType = s.ActivityType,
                    Calories = s.Calories,
                    MinHeartBeat = s.MinHeartBeat,
                    MaxHeartBeat = s.MaxHeartBeat,
                    Duration = s.Duration
                })
                .ToListAsync();

            return Ok(reports);
        }

        // GET: api/sportreports/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<SportReportResponseDto>> GetSportReport(Guid id)
        {
            var report = await _context.SportReports.FindAsync(id);

            if (report == null)
            {
                return NotFound($"Sport report with ID {id} not found.");
            }

            var reportResponse = new SportReportResponseDto
            {
                SportReportId = report.SportReportId,
                UserId = report.UserId,
                ActivityType = report.ActivityType,
                Calories = report.Calories,
                MinHeartBeat = report.MinHeartBeat,
                MaxHeartBeat = report.MaxHeartBeat,
                Duration = report.Duration
            };

            return Ok(reportResponse);
        }

        // POST: api/sportreports
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SportReportResponseDto>> CreateSportReport(CreateSportReportDto createSportReportDto)
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
            
            var report = new SportReport
            {
                SportReportId = Guid.NewGuid(),
                UserId = userId,
                ActivityType = createSportReportDto.ActivityType,
                Calories = createSportReportDto.Calories,
                MinHeartBeat = createSportReportDto.MinHeartBeat,
                MaxHeartBeat = createSportReportDto.MaxHeartBeat,
                Duration = createSportReportDto.Duration
            };

            _context.SportReports.Add(report);
            await _context.SaveChangesAsync();

            var reportResponse = new SportReportResponseDto
            {
                SportReportId = report.SportReportId,
                UserId = report.UserId,
                ActivityType = report.ActivityType,
                Calories = report.Calories,
                MinHeartBeat = report.MinHeartBeat,
                MaxHeartBeat = report.MaxHeartBeat,
                Duration = report.Duration
            };

            return CreatedAtAction(nameof(GetSportReport), new { id = report.SportReportId }, reportResponse);
        }
    }
}