using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string PatientCode { get; set; } = string.Empty; // e.g. PAT-2026-8942

        [Required]
        public string FullName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; } = "Other"; // Male, Female, Other

        public string ContactInfo { get; set; } = string.Empty;

        public string EmergencyContact { get; set; } = string.Empty;

        // Hospitality & Center Requirements
        public string AccommodationType { get; set; } = "Standard Room"; // Standard Room, Deluxe Suite, ICU / Specialized Bed, Day Ward

        public string DietaryPreferences { get; set; } = "None"; // Vegetarian, Diabetic, Low Sodium, Allergies

        public string AccessibilityNeeds { get; set; } = "None"; // Wheelchair Accessible, Oxygen Supply, Nurse Assistance

        public string MedicalSpecialty { get; set; } = "General Medicine"; // Cardiology, Oncology, ICU, Neurology, Orthopedics

        public string AttendingPhysician { get; set; } = "Dr. Sarah Jenkins";

        public string SpecialNotes { get; set; } = string.Empty;

        public string Status { get; set; } = "Admitted"; // Scheduled, Admitted, Discharged

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
