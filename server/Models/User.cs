using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public enum Lifestyle
    {
        SEDENTARY,
        LIGHTLY_ACTIVE,
        MODERATELY_ACTIVE,
        VERY_ACTIVE,
        EXTRA_ACTIVE
    }

    public class User
    {
        [Key]
        public Guid UserId { get; set; }
        public ICollection<DailyReport> DailyReports { get; set; } = new List<DailyReport>();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Age { get; set; }
        public double Weight { get; set; }
        public Lifestyle Lifestyle { get; set; }
    }
}
