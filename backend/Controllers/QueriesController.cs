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
    public class QueriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public QueriesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetQueries([FromQuery] string? status)
        {
            var query = _db.Queries
                .Include(q => q.Patient)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && status != "All") query = query.Where(q => q.Status == status);

            var list = await query.OrderByDescending(q => q.CreatedAt)
                .Select(q => new
                {
                    id = q.Id,
                    patientId = q.PatientId,
                    patientName = q.Patient != null ? q.Patient.FullName : "General Guest",
                    patientCode = q.Patient != null ? q.Patient.PatientCode : "",
                    attenderName = q.AttenderName,
                    subject = q.Subject,
                    question = q.Question,
                    category = q.Category,
                    answer = q.Answer,
                    answeredBy = q.AnsweredBy,
                    status = q.Status,
                    createdAt = q.CreatedAt,
                    answeredAt = q.AnsweredAt
                }).ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuery([FromBody] QueryCreateDto dto)
        {
            var item = new PatientQuery
            {
                PatientId = dto.PatientId,
                AttenderName = dto.AttenderName ?? "",
                Subject = dto.Subject,
                Question = dto.Question,
                Category = dto.Category ?? "General Inquiry",
                Status = "Open",
                SubmittedByUserId = 3,
                CreatedAt = DateTime.UtcNow
            };

            _db.Queries.Add(item);
            await _db.SaveChangesAsync();

            return Ok(item);
        }

        [HttpPut("{id}/answer")]
        public async Task<IActionResult> AnswerQuery(int id, [FromBody] QueryAnswerDto dto)
        {
            var item = await _db.Queries.FindAsync(id);
            if (item == null) return NotFound();

            item.Answer = dto.Answer;
            item.AnsweredBy = "Staff / Nurse Desk";
            item.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Resolved" : dto.Status;
            item.AnsweredAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(item);
        }
    }
}
