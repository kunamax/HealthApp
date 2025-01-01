using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class DailyReport
    {
        [Key]
        public Guid DailyReportId { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public int Water { get; set; }
        public int Steps { get; set; }
        public int Sleep { get; set; }
        public int Energy { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
