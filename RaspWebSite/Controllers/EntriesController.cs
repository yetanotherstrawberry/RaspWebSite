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
        /// Gets every <see cref="Entry"/> in the database with <see cref="Tag"/>s included.
        /// </summary>
        /// <returns>Returns <see cref="IAsyncEnumerable{Entry}"/> of <see cref="Entry"/> with nested <see cref="Tag"/>s.</returns>
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Entry))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(int))]
        public async Task<IActionResult> RemoveAsync(int id)
        {
            var dbItem = await _db.Entries.FindAsync(id);
            if (dbItem != null)
            {
                _db.Remove(dbItem);
                await _db.SaveChangesAsync();
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
        /// <returns><see cref="OkObjectResult"/> if added. <see cref="BadRequestObjectResult"/> if <paramref name="item"/>'s ID is not 0. Always nests <paramref name="item"/>.</returns>
        [Authorize]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Entry))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(Entry))]
        public async Task<IActionResult> AddAsync([FromBody] EntryDTO item)
        {
            if (item.Id != 0) return BadRequest(item);
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
        /// <param name="itemDTO">Instance of an <see cref="Entry"/>. Must be supplied in the request body.</param>
        /// <returns><see cref="OkObjectResult"/> or <see cref="NotFoundObjectResult"/>, if ID not found in the database. Always returns <paramref name="itemDTO"/>.</returns>
        [Authorize]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Entry))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(Entry))]
        public async Task<IActionResult> EditAsync([FromBody] EntryDTO itemDTO)
        {
            var dbItem = await _db.Entries.Include(entry => entry.Tags).SingleOrDefaultAsync(dbItem => dbItem.Id == itemDTO.Id);
            if (dbItem != null)
            {
                _mapper.Map(itemDTO, dbItem);
                dbItem.Tags = await _db.Tags.Where(tag => itemDTO.TagIds.Contains(tag.Id)).ToListAsync();
                await _db.SaveChangesAsync();
                _logger.LogDebug("Edited an entry with ID: {id}.", dbItem.Id);
                return Ok(dbItem);
            }
            else
            {
                _logger.LogWarning("Could not edit an entry with ID: {id}.", itemDTO.Id);
                return NotFound(itemDTO);
            }
        }

    }
}
