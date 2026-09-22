using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class PatientFeedback
    {
        [Key]
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        // Patient Attender Details
        [Required]
        public string AttenderName { get; set; } = string.Empty;

        public string AttenderRelationship { get; set; } = "Relative"; // Spouse, Parent, Child, Relative, Guardian

        public string AttenderContact { get; set; } = string.Empty;

        public string AttenderBadgeId { get; set; } = string.Empty; // e.g. ATT-2026-904

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; } = 5; // 1 to 5 stars

        public string Category { get; set; } = "Hospitality"; // Hospitality, Catering & Dietary, Nursing Care, Facilities & Cleanliness

        [Required]
        public string Comments { get; set; } = string.Empty;

        public string StaffResponse { get; set; } = string.Empty; // Response written by Admin or Staff

        public string Status { get; set; } = "Pending Review"; // Pending Review, Reviewed, Action Taken

        public int SubmittedByUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
