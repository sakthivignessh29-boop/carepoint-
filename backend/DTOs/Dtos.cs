using System;

namespace HospitalityApi.DTOs
{
    public record LoginDto(string Email, string Password);
    public record RegisterDto(string FullName, string Email, string Password, string Role);
    public record AuthResponseDto(string Token, string Email, string FullName, string Role);

    public record PatientCreateDto(
        string FullName,
        string DateOfBirth,
        string Gender,
        string ContactInfo,
        string EmergencyContact,
        string AccommodationType,
        string DietaryPreferences,
        string AccessibilityNeeds,
        string MedicalSpecialty,
        string AttendingPhysician,
        string SpecialNotes,
        string Status
    );

    public record ResourceCreateDto(
        string Name,
        string Type,
        string Category,
        string Description,
        string Status
    );

    public record BookingCreateDto(
        int PatientId,
        int ResourceId,
        DateTime StartTime,
        DateTime EndTime,
        string Purpose
    );

    public record BookingUpdateDto(
        int PatientId,
        int ResourceId,
        DateTime StartTime,
        DateTime EndTime,
        string Purpose,
        string Status,
        string? UpdateNotes
    );

    public record FeedbackCreateDto(
        int PatientId,
        string AttenderName,
        string AttenderRelationship,
        string AttenderContact,
        string AttenderBadgeId,
        int Rating,
        string Category,
        string Comments
    );

    public record FeedbackStaffResponseDto(
        string StaffResponse,
        string Status
    );

    public record QueryCreateDto(
        int? PatientId,
        string AttenderName,
        string Subject,
        string Question,
        string Category
    );

    public record QueryAnswerDto(
        string Answer,
        string Status
    );

    public record ChatRequestDto(
        string Prompt,
        string? PatientCode,
        string? Role
    );
}
