using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class Resource
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g. "Room 101 - Deluxe Bed", "MRI Machine A", "VIP Suite 204"

        [Required]
        public string Type { get; set; } = "Room"; // Room, Bed, Medical Equipment

        public string Category { get; set; } = "General"; // Hospitality, ICU, Radiology, Consultation

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Available"; // Available, Reserved, Maintenance

        // Concurrency token for Optimistic Concurrency Control (OCC)
        [ConcurrencyCheck]
        public string ConcurrencyToken { get; set; } = Guid.NewGuid().ToString();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
