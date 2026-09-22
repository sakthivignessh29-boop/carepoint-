using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        public int ResourceId { get; set; }
        public Resource? Resource { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public string Purpose { get; set; } = string.Empty;

        public int BookedByUserId { get; set; }

        public string Status { get; set; } = "Booked"; // Booked, Confirmed, Cancelled, Updated

        public string UpdateNotes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CancelledAt { get; set; }
    }
}
