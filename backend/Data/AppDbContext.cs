using System;
using HospitalityApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Patient> Patients { get; set; } = null!;
        public DbSet<Resource> Resources { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<PatientFeedback> Feedbacks { get; set; } = null!;
        public DbSet<PatientQuery> Queries { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Optimistic Concurrency Control on Resource
            modelBuilder.Entity<Resource>()
                .Property(r => r.ConcurrencyToken)
                .IsConcurrencyToken();

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "System Administrator",
                    Email = "admin@hospitality.org",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    FullName = "Nurse Sarah Connor",
                    Email = "staff@hospitality.org",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Staff@123"),
                    Role = "Staff",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 3,
                    FullName = "John Doe (Patient)",
                    Email = "patient@hospitality.org",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient@123"),
                    Role = "Patient",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Resources
            modelBuilder.Entity<Resource>().HasData(
                new Resource
                {
                    Id = 1,
                    Name = "Deluxe Suite 101 - VIP Bed",
                    Type = "Room",
                    Category = "Hospitality Suite",
                    Description = "Spacious suite with private bath, guest lounge, and emergency call panel",
                    Status = "Available",
                    ConcurrencyToken = "seed-token-101",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Resource
                {
                    Id = 2,
                    Name = "ICU Specialized Bed 04",
                    Type = "Bed",
                    Category = "Critical Care",
                    Description = "Fully automated ICU bed with telemetry and central oxygen feed",
                    Status = "Available",
                    ConcurrencyToken = "seed-token-icu04",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Resource
                {
                    Id = 3,
                    Name = "3T MRI Scanner Unit A",
                    Type = "Medical Equipment",
                    Category = "Radiology",
                    Description = "High-field magnetic resonance imaging scanner for neuro and cardiac scans",
                    Status = "Available",
                    ConcurrencyToken = "seed-token-mri3t",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Resource
                {
                    Id = 4,
                    Name = "Standard Recovery Room 205",
                    Type = "Room",
                    Category = "Day Ward",
                    Description = "Comfortable day-ward accommodation for post-procedure monitoring",
                    Status = "Available",
                    ConcurrencyToken = "seed-token-205",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Resource
                {
                    Id = 5,
                    Name = "Portable Oxygen Concentrator X1",
                    Type = "Medical Equipment",
                    Category = "Pulmonology",
                    Description = "High-flow continuous oxygen delivery unit",
                    Status = "Available",
                    ConcurrencyToken = "seed-token-oxyx1",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Patients
            modelBuilder.Entity<Patient>().HasData(
                new Patient
                {
                    Id = 1,
                    PatientCode = "PAT-2026-1089",
                    FullName = "Eleanor Vance",
                    DateOfBirth = new DateTime(1985, 4, 12),
                    Gender = "Female",
                    ContactInfo = "+1 (555) 234-5678",
                    EmergencyContact = "Robert Vance (+1 555-987-6543)",
                    AccommodationType = "Deluxe Suite",
                    DietaryPreferences = "Low Sodium",
                    AccessibilityNeeds = "Wheelchair Accessible",
                    MedicalSpecialty = "Cardiology",
                    AttendingPhysician = "Dr. Marcus Vance",
                    SpecialNotes = "Requires extra quiet environment and cardiac telemetry monitoring.",
                    Status = "Admitted",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Patient
                {
                    Id = 2,
                    PatientCode = "PAT-2026-2144",
                    FullName = "Arthur Pendelton",
                    DateOfBirth = new DateTime(1962, 11, 30),
                    Gender = "Male",
                    ContactInfo = "+1 (555) 876-5432",
                    EmergencyContact = "Claire Pendelton (+1 555-111-2233)",
                    AccommodationType = "ICU / Specialized Bed",
                    DietaryPreferences = "Diabetic",
                    AccessibilityNeeds = "Oxygen Supply, Nurse Assistance",
                    MedicalSpecialty = "ICU",
                    AttendingPhysician = "Dr. Sarah Jenkins",
                    SpecialNotes = "Post-op recovery; strict blood sugar checks every 4 hours.",
                    Status = "Admitted",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Patient
                {
                    Id = 3,
                    PatientCode = "PAT-2026-3091",
                    FullName = "Sophia Martinez",
                    DateOfBirth = new DateTime(1994, 8, 19),
                    Gender = "Female",
                    ContactInfo = "+1 (555) 432-1098",
                    EmergencyContact = "Carlos Martinez (+1 555-333-4455)",
                    AccommodationType = "Standard Room",
                    DietaryPreferences = "Vegetarian",
                    AccessibilityNeeds = "None",
                    MedicalSpecialty = "Neurology",
                    AttendingPhysician = "Dr. Emily Zhang",
                    SpecialNotes = "Scheduled for MRI scan and follow-up consultation.",
                    Status = "Scheduled",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Bookings
            var today = DateTime.UtcNow.Date;
            modelBuilder.Entity<Booking>().HasData(
                new Booking
                {
                    Id = 1,
                    PatientId = 1,
                    ResourceId = 1,
                    StartTime = today.AddHours(9),
                    EndTime = today.AddHours(14),
                    Purpose = "Post-Op Cardiac Monitoring & Hospitality Stay",
                    BookedByUserId = 2,
                    Status = "Confirmed",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Booking
                {
                    Id = 2,
                    PatientId = 3,
                    ResourceId = 3,
                    StartTime = today.AddHours(15),
                    EndTime = today.AddHours(17),
                    Purpose = "Brain MRI Scan & Diagnostic Mapping",
                    BookedByUserId = 2,
                    Status = "Confirmed",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Feedbacks with Patient Attender Details
            modelBuilder.Entity<PatientFeedback>().HasData(
                new PatientFeedback
                {
                    Id = 1,
                    PatientId = 1,
                    AttenderName = "Robert Vance",
                    AttenderRelationship = "Spouse",
                    AttenderContact = "+1 (555) 987-6543",
                    AttenderBadgeId = "ATT-2026-1089A",
                    Rating = 5,
                    Category = "Hospitality Suite",
                    Comments = "The Deluxe Suite was exceptionally comfortable for both Eleanor and myself. The nursing staff checked on her telemetry regularly.",
                    StaffResponse = "Thank you Robert! We are delighted to hear the suite met your expectations.",
                    Status = "Action Taken",
                    SubmittedByUserId = 3,
                    CreatedAt = new DateTime(2026, 1, 2, 10, 30, 0, DateTimeKind.Utc)
                },
                new PatientFeedback
                {
                    Id = 2,
                    PatientId = 2,
                    AttenderName = "Claire Pendelton",
                    AttenderRelationship = "Daughter",
                    AttenderContact = "+1 (555) 111-2233",
                    AttenderBadgeId = "ATT-2026-2144B",
                    Rating = 4,
                    Category = "Catering & Dietary",
                    Comments = "The diabetic low-sugar menu option was prompt, but could use more variety for lunch.",
                    StaffResponse = "We have notified the executive catering chef to add diabetic fruit options.",
                    Status = "Reviewed",
                    SubmittedByUserId = 3,
                    CreatedAt = new DateTime(2026, 1, 3, 14, 15, 0, DateTimeKind.Utc)
                }
            );

            // Seed Patient Queries
            modelBuilder.Entity<PatientQuery>().HasData(
                new PatientQuery
                {
                    Id = 1,
                    PatientId = 1,
                    AttenderName = "Robert Vance",
                    Subject = "Visiting Hours for Deluxe Suites",
                    Question = "What are the allowed overnight stay policies for primary attenders in the Deluxe Suite?",
                    Category = "Visiting Hours",
                    Answer = "Primary attenders with a registered ATT badge are allowed 24/7 overnight stays in all Deluxe Suites with complimentary guest bedding.",
                    AnsweredBy = "Nurse Sarah Connor",
                    Status = "Resolved",
                    SubmittedByUserId = 3,
                    CreatedAt = new DateTime(2026, 1, 2, 08, 0, 0, DateTimeKind.Utc),
                    AnsweredAt = new DateTime(2026, 1, 2, 08, 30, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
