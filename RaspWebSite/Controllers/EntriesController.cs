using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaspWebSite.Models;

namespace RaspWebSite.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class EntriesController : ControllerBase
    {

        private readonly AppDbContext _db;
        private readonly ILogger<EntriesController> _logger;
        private readonly IMapper _mapper;

        public EntriesController(AppDbContext context, ILogger<EntriesController> logger, IMapper mapper)
        {
            _db = context;
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves and <see cref="Entry"/> from the database.
        /// </summary>
        /// <param name="id">ID of the <see cref="Entry"/> to be retrieved.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="Entry"/>. <see cref="NotFoundObjectResult"/> with <paramref name="id"/> if not found.</returns>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var dbItem = await _db.Entries.Include(entry => entry.Tags).SingleOrDefaultAsync(entry => entry.Id == id);
            if (dbItem != null)
            {
                _logger.LogDebug("Retrieved entry with ID: {id}.", id);
                return Ok(dbItem);
            }
            else
            {
                _logger.LogWarning("Could not find an entry with ID: {id}.", id);
                return NotFound(id);
            }
        }

        /// <summary>
        /// Gets every <see cref="Entry"/> in the database.
        /// </summary>
        /// <returns>Enumeration of the requested type.</returns>
        [HttpGet]
        public IAsyncEnumerable<Entry> GetAll()
        {
            _logger.LogDebug("Requested all entries from the database.");
            return _db.Entries.Include(entry => entry.Tags).AsAsyncEnumerable();
        }

        /// <summary>
        /// Removes an <see cref="Entry"/>.
        /// </summary>
        /// <param name="id">ID of the <see cref="Entry"/> to be removed.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="Entry"/>. <see cref="NotFoundObjectResult"/> with <paramref name="id"/> if not found.</returns>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var dbItem = await _db.Entries.FindAsync(id);
            if (dbItem != null)
            {
                _db.Remove(dbItem);
                _logger.LogDebug("Deleted entry with ID: {id}.", id);
                return Ok(dbItem);
            }
            else
            {
                _logger.LogWarning("Could not remove an entry with ID: {id}.", id);
                return NotFound(id);
            }
        }

        /// <summary>
        /// Creates an <see cref="Entry"/> in the database.
        /// </summary>
        /// <param name="item"><see cref="Entry"/> to be added.</param>
        /// <returns><see cref="OkObjectResult"/> with added <see cref="Entry"/>.</returns>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] EntryDTO item)
        {
            var newItem = _mapper.Map<Entry>(item);
            newItem.Tags = await _db.Tags.Where(tag => item.TagIds.Contains(tag.Id)).ToListAsync();
            var entityResult = await _db.AddAsync(newItem);
            await _db.SaveChangesAsync();
            _logger.LogDebug("Added an entry with ID: {id}.", entityResult.Entity.Id);
            return Ok(entityResult.Entity);
        }

        /// <summary>
        /// Edits an <see cref="Entry"/>.
        /// </summary>
        /// <param name="item">Instance of a <see cref="Entry"/> with a valid ID.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="Entry"/> after edits. <see cref="NotFoundObjectResult"/> with <paramref name="item"/>, if ID not found in the database.</returns>
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] Entry item)
        {
            var dbItem = await _db.Entries.FindAsync(item.Id);
            if (dbItem != null)
            {
                _db.Update(item);
                await _db.SaveChangesAsync();
                _logger.LogDebug("Edited an entry with ID: {id}.", dbItem.Id);
                return Ok(dbItem);
            }
            else
            {
                _logger.LogWarning("Could not edit an entry with ID: {id}.", item.Id);
                return NotFound(item);
            }
        }

    }
}
