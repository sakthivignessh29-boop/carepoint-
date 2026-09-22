using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class PatientQuery
    {
        [Key]
        public int Id { get; set; }

        public int? PatientId { get; set; }
        public Patient? Patient { get; set; }

        public string AttenderName { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Question { get; set; } = string.Empty;

        public string Category { get; set; } = "General Inquiry"; // General Inquiry, Room Allocation, Dietary, Visiting Hours, Medical Specialty

        public string Answer { get; set; } = string.Empty; // Staff answer

        public string AnsweredBy { get; set; } = string.Empty;

        public string Status { get; set; } = "Open"; // Open, In Progress, Resolved

        public int SubmittedByUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? AnsweredAt { get; set; }
    }
}
