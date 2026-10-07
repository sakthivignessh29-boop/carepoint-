using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using HospitalityApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Services
{
    public interface IBookingService
    {
        Task<(bool Success, bool IsConflict, string Message, Booking? Booking)> CreateBookingAsync(BookingCreateDto dto, int bookedByUserId);
        Task<(bool Success, bool IsConflict, string Message, Booking? Booking)> UpdateBookingAsync(int id, BookingUpdateDto dto, int updatedByUserId);
        Task<bool> CancelBookingAsync(int id);
    }

    public class BookingService : IBookingService
    {
        private readonly AppDbContext _db;

        public BookingService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<(bool Success, bool IsConflict, string Message, Booking? Booking)> CreateBookingAsync(BookingCreateDto dto, int bookedByUserId)
        {
            if (dto.StartTime >= dto.EndTime)
            {
                return (false, false, "Start time must be strictly before End time.", null);
            }

            if (dto.StartTime.ToUniversalTime() < DateTime.UtcNow.AddHours(-12))
            {
                return (false, false, "Cannot book slots in the past.", null);
            }

            using var transaction = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            try
            {
                var resource = await _db.Resources.FirstOrDefaultAsync(r => r.Id == dto.ResourceId);
                if (resource == null)
                {
                    return (false, false, "Target resource not found.", null);
                }

                if (resource.Status == "Maintenance")
                {
                    return (false, false, "Resource is currently under maintenance.", null);
                }

                // Check for overlapping bookings on the same resource excluding Cancelled
                var hasOverlap = await _db.Bookings.AnyAsync(b =>
                    b.ResourceId == dto.ResourceId &&
                    b.Status != "Cancelled" &&
                    (dto.StartTime < b.EndTime && dto.EndTime > b.StartTime)
                );

                if (hasOverlap)
                {
                    await transaction.RollbackAsync();
                    return (false, true, "⚠️ Conflict: This slot was just booked by another user. Please refresh and pick an alternate time.", null);
                }

                var booking = new Booking
                {
                    PatientId = dto.PatientId,
                    ResourceId = dto.ResourceId,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    Purpose = string.IsNullOrWhiteSpace(dto.Purpose) ? "Resource Reservation" : dto.Purpose,
                    BookedByUserId = bookedByUserId,
                    Status = "Booked",
                    CreatedAt = DateTime.UtcNow
                };

                _db.Bookings.Add(booking);

                // Mutate Concurrency Token
                resource.ConcurrencyToken = Guid.NewGuid().ToString();
                _db.Resources.Update(resource);

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                await _db.Entry(booking).Reference(b => b.Patient).LoadAsync();
                await _db.Entry(booking).Reference(b => b.Resource).LoadAsync();

                return (true, false, "Booking created successfully.", booking);
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return (false, true, "⚠️ Conflict: This slot was just booked by another user. Please refresh and pick an alternate time.", null);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, false, $"Internal server error during booking: {ex.Message}", null);
            }
        }

        public async Task<(bool Success, bool IsConflict, string Message, Booking? Booking)> UpdateBookingAsync(int id, BookingUpdateDto dto, int updatedByUserId)
        {
            if (dto.StartTime >= dto.EndTime)
            {
                return (false, false, "Start time must be strictly before End time.", null);
            }

            using var transaction = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            try
            {
                var booking = await _db.Bookings.FindAsync(id);
                if (booking == null)
                {
                    return (false, false, "Target booking not found.", null);
                }

                var resource = await _db.Resources.FirstOrDefaultAsync(r => r.Id == dto.ResourceId);
                if (resource == null)
                {
                    return (false, false, "Target resource not found.", null);
                }

                // Overlap check excluding current booking ID
                var hasOverlap = await _db.Bookings.AnyAsync(b =>
                    b.Id != id &&
                    b.ResourceId == dto.ResourceId &&
                    b.Status != "Cancelled" &&
                    (dto.StartTime < b.EndTime && dto.EndTime > b.StartTime)
                );

                if (hasOverlap)
                {
                    await transaction.RollbackAsync();
                    return (false, true, "⚠️ Conflict: Rescheduled slot overlaps with an existing reservation. Pick an alternate time.", null);
                }

                booking.PatientId = dto.PatientId;
                booking.ResourceId = dto.ResourceId;
                booking.StartTime = dto.StartTime;
                booking.EndTime = dto.EndTime;
                booking.Purpose = dto.Purpose;
                booking.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Updated" : dto.Status;
                booking.UpdateNotes = dto.UpdateNotes ?? "Rescheduled by staff";
                booking.UpdatedAt = DateTime.UtcNow;

                resource.ConcurrencyToken = Guid.NewGuid().ToString();
                _db.Resources.Update(resource);

                await _db.SaveChangesAsync();
                await transaction.CommitAsync();

                await _db.Entry(booking).Reference(b => b.Patient).LoadAsync();
                await _db.Entry(booking).Reference(b => b.Resource).LoadAsync();

                return (true, false, "Booking updated & rescheduled successfully.", booking);
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return (false, true, "⚠️ Conflict: Target slot was modified concurrently. Please refresh.", null);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, false, $"Internal server error: {ex.Message}", null);
            }
        }

        public async Task<bool> CancelBookingAsync(int id)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) return false;

            booking.Status = "Cancelled";
            booking.CancelledAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return true;
        }
    }
}
