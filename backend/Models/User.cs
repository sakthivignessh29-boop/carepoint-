using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalityApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Patient"; // Patient, Staff, Admin

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
