namespace HealthApp.Configuration
{
    public class JwtSettings
    {
        public const string SectionName = "Jwt";
        
        public string Key { get; set; } = string.Empty;
        public string Issuer { get; set; } = "HealthApp";
        public string Audience { get; set; } = "HealthAppUsers";
        public int ExpiryHours { get; set; } = 1;
    }
}
