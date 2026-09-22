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
    public class ResourcesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ResourcesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resource>>> GetResources([FromQuery] string? type, [FromQuery] string? status)
        {
            var query = _db.Resources.AsQueryable();

            if (!string.IsNullOrWhiteSpace(type) && type != "All")
            {
                query = query.Where(r => r.Type == type);
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                query = query.Where(r => r.Status == status);
            }

            var list = await query.ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resource>> GetResource(int id)
        {
            var res = await _db.Resources.FindAsync(id);
            if (res == null) return NotFound();
            return Ok(res);
        }

        [HttpPost]
        public async Task<ActionResult<Resource>> CreateResource([FromBody] ResourceCreateDto dto)
        {
            var resource = new Resource
            {
                Name = dto.Name,
                Type = dto.Type,
                Category = dto.Category,
                Description = dto.Description,
                Status = dto.Status ?? "Available",
                ConcurrencyToken = Guid.NewGuid().ToString()
            };

            _db.Resources.Add(resource);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetResource), new { id = resource.Id }, resource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(int id, [FromBody] ResourceCreateDto dto)
        {
            var res = await _db.Resources.FindAsync(id);
            if (res == null) return NotFound();

            res.Name = dto.Name;
            res.Type = dto.Type;
            res.Category = dto.Category;
            res.Description = dto.Description;
            res.Status = dto.Status;
            res.ConcurrencyToken = Guid.NewGuid().ToString();

            await _db.SaveChangesAsync();
            return Ok(res);
        }
    }
}
