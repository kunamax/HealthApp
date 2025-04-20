using System.ComponentModel.DataAnnotations;

namespace HealthApp.Models
{
    public class SportReport
    {
        [Key]
        public Guid SportReportId { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public int Calories { get; set; }
        public int MinHeartBeat { get; set; }
        public int MaxHeartBeat { get; set; }
        public TimeSpan Duration { get; set; }
    }
}