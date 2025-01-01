namespace HealthApp.DTOs
{
    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Age { get; set; }
        public double Weight { get; set; }
        public string Lifestyle { get; set; } = string.Empty;
    }

    public class UserResponseDto
    {
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Age { get; set; }
        public double Weight { get; set; }
        public string Lifestyle { get; set; } = string.Empty;
    }

    public class CreateDailyReportDto
    {
        public Guid UserId { get; set; }
        public int Water { get; set; }
        public int Steps { get; set; }
        public int Sleep { get; set; }
        public int Energy { get; set; }
    }

    public class DailyReportResponseDto
    {
        public Guid DailyReportId { get; set; }
        public Guid UserId { get; set; }
        public int Water { get; set; }
        public int Steps { get; set; }
        public int Sleep { get; set; }
        public int Energy { get; set; }
        public DateTime Date { get; set; }
    }
}
