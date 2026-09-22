using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using HospitalityApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PatientsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients([FromQuery] string? search, [FromQuery] string? status, [FromQuery] string? accommodation)
        {
            var query = _db.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(p => p.FullName.ToLower().Contains(term) || p.PatientCode.ToLower().Contains(term) || p.MedicalSpecialty.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                query = query.Where(p => p.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(accommodation) && accommodation != "All")
            {
                query = query.Where(p => p.AccommodationType == accommodation);
            }

            var list = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] PatientCreateDto dto)
        {
            var randomCode = $"PAT-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}";
            DateTime dob = DateTime.TryParse(dto.DateOfBirth, out var parsedDob) ? parsedDob : DateTime.UtcNow.AddYears(-30);

            var patient = new Patient
            {
                PatientCode = randomCode,
                FullName = dto.FullName,
                DateOfBirth = dob,
                Gender = string.IsNullOrWhiteSpace(dto.Gender) ? "Other" : dto.Gender,
                ContactInfo = dto.ContactInfo ?? "",
                EmergencyContact = dto.EmergencyContact ?? "",
                AccommodationType = string.IsNullOrWhiteSpace(dto.AccommodationType) ? "Standard Room" : dto.AccommodationType,
                DietaryPreferences = string.IsNullOrWhiteSpace(dto.DietaryPreferences) ? "None" : dto.DietaryPreferences,
                AccessibilityNeeds = string.IsNullOrWhiteSpace(dto.AccessibilityNeeds) ? "None" : dto.AccessibilityNeeds,
                MedicalSpecialty = string.IsNullOrWhiteSpace(dto.MedicalSpecialty) ? "General Medicine" : dto.MedicalSpecialty,
                AttendingPhysician = string.IsNullOrWhiteSpace(dto.AttendingPhysician) ? "Dr. Sarah Jenkins" : dto.AttendingPhysician,
                SpecialNotes = dto.SpecialNotes ?? "",
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Admitted" : dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _db.Patients.Add(patient);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientCreateDto dto)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            patient.FullName = dto.FullName;
            if (DateTime.TryParse(dto.DateOfBirth, out var parsedDob)) patient.DateOfBirth = parsedDob;
            patient.Gender = dto.Gender;
            patient.ContactInfo = dto.ContactInfo;
            patient.EmergencyContact = dto.EmergencyContact;
            patient.AccommodationType = dto.AccommodationType;
            patient.DietaryPreferences = dto.DietaryPreferences;
            patient.AccessibilityNeeds = dto.AccessibilityNeeds;
            patient.MedicalSpecialty = dto.MedicalSpecialty;
            patient.AttendingPhysician = dto.AttendingPhysician;
            patient.SpecialNotes = dto.SpecialNotes;
            patient.Status = dto.Status;

            await _db.SaveChangesAsync();
            return Ok(patient);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _db.Patients.Remove(patient);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
