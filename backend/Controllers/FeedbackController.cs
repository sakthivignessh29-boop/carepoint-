using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using HospitalityApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _db;

        public FeedbackController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFeedbacks([FromQuery] int? patientId, [FromQuery] string? category)
        {
            var query = _db.Feedbacks
                .Include(f => f.Patient)
                .AsQueryable();

            if (patientId.HasValue) query = query.Where(f => f.PatientId == patientId.Value);
            if (!string.IsNullOrWhiteSpace(category) && category != "All") query = query.Where(f => f.Category == category);

            var list = await query.OrderByDescending(f => f.CreatedAt)
                .Select(f => new
                {
                    id = f.Id,
                    patientId = f.PatientId,
                    patientName = f.Patient != null ? f.Patient.FullName : "Unknown Patient",
                    patientCode = f.Patient != null ? f.Patient.PatientCode : "",
                    accommodationType = f.Patient != null ? f.Patient.AccommodationType : "",
                    attenderName = f.AttenderName,
                    attenderRelationship = f.AttenderRelationship,
                    attenderContact = f.AttenderContact,
                    attenderBadgeId = f.AttenderBadgeId,
                    rating = f.Rating,
                    category = f.Category,
                    comments = f.Comments,
                    staffResponse = f.StaffResponse,
                    status = f.Status,
                    createdAt = f.CreatedAt
                }).ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] FeedbackCreateDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5 stars." });
            }

            var feedback = new PatientFeedback
            {
                PatientId = dto.PatientId,
                AttenderName = dto.AttenderName ?? "Primary Attender",
                AttenderRelationship = dto.AttenderRelationship ?? "Relative",
                AttenderContact = dto.AttenderContact ?? "",
                AttenderBadgeId = string.IsNullOrWhiteSpace(dto.AttenderBadgeId) ? $"ATT-{DateTime.UtcNow.Year}-{Random.Shared.Next(1000, 9999)}" : dto.AttenderBadgeId,
                Rating = dto.Rating,
                Category = dto.Category ?? "Hospitality",
                Comments = dto.Comments,
                Status = "Pending Review",
                SubmittedByUserId = 3,
                CreatedAt = DateTime.UtcNow
            };

            _db.Feedbacks.Add(feedback);
            await _db.SaveChangesAsync();

            return Ok(feedback);
        }

        [HttpPut("{id}/respond")]
        public async Task<IActionResult> RespondFeedback(int id, [FromBody] FeedbackStaffResponseDto dto)
        {
            var feedback = await _db.Feedbacks.FindAsync(id);
            if (feedback == null) return NotFound();

            feedback.StaffResponse = dto.StaffResponse;
            feedback.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Action Taken" : dto.Status;

            await _db.SaveChangesAsync();
            return Ok(feedback);
        }
    }
}
