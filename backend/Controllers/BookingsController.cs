using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using HospitalityApi.Models;
using HospitalityApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IBookingService _bookingService;

        public BookingsController(AppDbContext db, IBookingService bookingService)
        {
            _db = db;
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBookings(
            [FromQuery] int? resourceId,
            [FromQuery] int? patientId,
            [FromQuery] string? status,
            [FromQuery] DateTime? start,
            [FromQuery] DateTime? end)
        {
            var query = _db.Bookings
                .Include(b => b.Patient)
                .Include(b => b.Resource)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                query = query.Where(b => b.Status == status);
            }

            if (resourceId.HasValue) query = query.Where(b => b.ResourceId == resourceId.Value);
            if (patientId.HasValue) query = query.Where(b => b.PatientId == patientId.Value);
            if (start.HasValue) query = query.Where(b => b.EndTime >= start.Value);
            if (end.HasValue) query = query.Where(b => b.StartTime <= end.Value);

            var list = await query.OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    id = b.Id,
                    patientId = b.PatientId,
                    patientName = b.Patient != null ? b.Patient.FullName : "Unknown Patient",
                    patientCode = b.Patient != null ? b.Patient.PatientCode : "",
                    resourceId = b.ResourceId,
                    resourceName = b.Resource != null ? b.Resource.Name : "Unknown Resource",
                    resourceType = b.Resource != null ? b.Resource.Type : "",
                    start = b.StartTime.ToString("o"),
                    end = b.EndTime.ToString("o"),
                    title = b.Resource != null && b.Patient != null
                        ? $"[{b.Status}] {b.Resource.Name} - {b.Patient.FullName}"
                        : "Resource Reservation",
                    purpose = b.Purpose,
                    status = b.Status,
                    updateNotes = b.UpdateNotes,
                    bookedByUserId = b.BookedByUserId,
                    createdAt = b.CreatedAt,
                    updatedAt = b.UpdatedAt,
                    cancelledAt = b.CancelledAt
                }).ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            int userId = 2;
            var claimVal = User.FindFirst("UserId")?.Value;
            if (int.TryParse(claimVal, out var parsedId)) userId = parsedId;

            var result = await _bookingService.CreateBookingAsync(dto, userId);

            if (result.IsConflict)
            {
                return StatusCode(409, new
                {
                    message = result.Message,
                    conflict = true,
                    resourceId = dto.ResourceId,
                    startTime = dto.StartTime,
                    endTime = dto.EndTime
                });
            }

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return CreatedAtAction(nameof(GetBookings), new { id = result.Booking?.Id }, result.Booking);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] BookingUpdateDto dto)
        {
            int userId = 2;
            var claimVal = User.FindFirst("UserId")?.Value;
            if (int.TryParse(claimVal, out var parsedId)) userId = parsedId;

            var result = await _bookingService.UpdateBookingAsync(id, dto, userId);

            if (result.IsConflict)
            {
                return StatusCode(409, new
                {
                    message = result.Message,
                    conflict = true,
                    resourceId = dto.ResourceId
                });
            }

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Booking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var success = await _bookingService.CancelBookingAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}
