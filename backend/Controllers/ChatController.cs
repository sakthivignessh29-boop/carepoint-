using System;
using System.Linq;
using System.Threading.Tasks;
using HospitalityApi.Data;
using HospitalityApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ChatController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> AskAi([FromBody] ChatRequestDto dto)
        {
            var p = dto.Prompt.ToLower();
            string reply = "";
            string category = "Hospitality Assistant";

            if (p.Contains("visiting") || p.Contains("hours") || p.Contains("guest") || p.Contains("overnight"))
            {
                reply = "🏥 **Visiting Hours & Overnight Stay Policies:**\n\n- **Deluxe Suites:** Primary registered attenders with ATT Badges are allowed 24/7 overnight stays with complimentary guest bedding.\n- **Standard Rooms & Day Wards:** Visiting hours are from 08:00 AM to 08:00 PM daily (max 2 visitors per slot).\n- **ICU & Critical Care:** Restricted visiting from 11:00 AM – 12:00 PM and 05:00 PM – 06:00 PM (1 visitor at a time).";
                category = "Visiting Rules";
            }
            else if (p.Contains("diet") || p.Contains("food") || p.Contains("meal") || p.Contains("diabetic") || p.Contains("sodium") || p.Contains("vegetarian"))
            {
                reply = "🥗 **Catering & Dietary Services:**\n\nCarePoint Hub offers specialized dietary menus tailored to patient intake requirements:\n- **Diabetic Menu:** Low glycemic index meal plans curated by clinical dietitians.\n- **Low Sodium Menu:** Cardiac-friendly, low-salt gourmet preparation.\n- **Vegetarian & Allergen-Free:** Custom pure-vegetarian options available on request.\n\nYou can update your meal preferences directly from the Patient Intake Directory!";
                category = "Dietary Care";
            }
            else if (p.Contains("book") || p.Contains("room") || p.Contains("bed") || p.Contains("mri") || p.Contains("equipment") || p.Contains("schedule"))
            {
                var availableRooms = await _db.Resources.Where(r => r.Status == "Available").Select(r => r.Name).ToListAsync();
                var roomsListStr = availableRooms.Count > 0 ? string.Join(", ", availableRooms) : "All units currently reserved";

                reply = $"🛏️ **Resource Scheduling & Booking Rules:**\n\n- **Concurrency Protection:** All room, bed, and MRI scanner bookings are protected by DB transactions with `HTTP 409 Conflict` double-booking rollback.\n- **Currently Available Resources:** {roomsListStr}.\n- **How to Book:** Navigate to the **Resource Scheduling** tab, pick a time-grid slot, and confirm patient details.";
                category = "Resource Booking";
            }
            else if (p.Contains("emergency") || p.Contains("doctor") || p.Contains("nurse") || p.Contains("call"))
            {
                reply = "🚨 **Emergency Assistance Protocols:**\n\n- **Nurse Call Panel:** Press the red button next to your bedside console or inside your Deluxe Suite bathroom.\n- **Duty Physician:** Dr. Sarah Jenkins and Dr. Marcus Vance are currently on active round rotation.\n- **Emergency Desk Direct Line:** Extension #911 / +1 (555) 911-CARE.";
                category = "Emergency Protocol";
            }
            else if (p.Contains("feedback") || p.Contains("rating") || p.Contains("attender"))
            {
                reply = "⭐ **Feedback & Attender Details Portal:**\n\nPatients and Attenders can submit feedback directly via the **Feedback & Attender Center** tab!\n- Include your **Attender Badge ID**, relationship, and star rating.\n- All feedback items are reviewed by Administrators & Nursing Staff to continuously enhance care quality.";
                category = "Feedback Support";
            }
            else
            {
                reply = $"🤖 **CarePoint AI Assistant:**\n\nHello! I am your CarePoint Healthcare & Hospitality AI Assistant. I can help you with:\n1. 🛏️ **Room, Bed & Equipment Reservations** (Deluxe Suites, ICU Beds, MRI Scanners)\n2. 🥗 **Dietary & Catering Preferences** (Diabetic, Low Sodium, Vegetarian)\n3. 🕒 **Visiting Hours & Attender Overnight Stay Rules**\n4. ⭐ **Feedback & Queries Desk**\n\nFeel free to ask any question or pick a quick prompt below!";
            }

            return Ok(new
            {
                reply = reply,
                category = category,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }
    }
}
