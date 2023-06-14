using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaspWebSite.Models;

namespace RaspWebSite.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TagsController : ControllerBase
    {

        private readonly AppDbContext _db;
        private readonly ILogger<TagsController> _logger;

        public TagsController(AppDbContext context, ILogger<TagsController> logger)
        {
            _db = context;
            _logger = logger;
        }

        [HttpGet]
        public IAsyncEnumerable<Tag> GetAll()
        {
            return _db.Tags.OrderBy(tag => tag.Name).AsAsyncEnumerable();
        }

        /// <summary>
        /// Creates a <see cref="Tag"/> in the database.
        /// </summary>
        /// <param name="item"><see cref="Tag"/> to be added.</param>
        /// <returns><see cref="OkObjectResult"/> with added <see cref="Tag"/>.</returns>
        [HttpPost]
        public async Task<IActionResult> AddAsync([FromBody] Tag item)
        {
            await _db.AddAsync(item);
            await _db.SaveChangesAsync();
            _logger.LogDebug("Added a tag with ID: {id}.", item.Id);
            return Ok(item);
        }

        /// <summary>
        /// Deletes a <see cref="Tag"/> with the requested <paramref name="id"/>.
        /// </summary>
        /// <param name="id">ID of the tag that is to be deleted.</param>
        /// <returns><see cref="OkObjectResult"/> with the deleted <see cref="Tag"/>. <see cref="NotFoundObjectResult"/> with <paramref name="id"/> if not found.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(int id)
        {
            var item = await _db.Tags.FindAsync(id);
            if (item != null)
            {
                _db.Remove(item);
                await _db.SaveChangesAsync();
                _logger.LogDebug("Removed a tag with ID: {id}.", id);
                return Ok(item);
            }
            else
            {
                _logger.LogWarning("Could not remove a tag with ID: {id}.", id);
                return NotFound(id);
            }
        }

        /// <summary>
        /// Edits a <see cref="Tag"/>.
        /// </summary>
        /// <param name="tag">Instance of a <see cref="Tag"/> with a valid ID.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="Tag"/> after edits. <see cref="NotFoundObjectResult"/> with <paramref name="tag"/>, if ID not found in the database.</returns>
        [HttpPut]
        public async Task<IActionResult> EditAsync([FromBody] Tag tag)
        {
            var dbItem = await _db.Tags.FindAsync(tag.Id);
            if (dbItem != null)
            {
                _db.Update(tag);
                await _db.SaveChangesAsync();
                _logger.LogDebug("Edited a tag with ID: {id}.", dbItem.Id);
                return Ok(dbItem);
            }
            else
            {
                _logger.LogWarning("Could not edit a tag with ID: {id}.", tag.Id);
                return NotFound(tag);
            }
        }

        /// <summary>
        /// Searches the database for a <see cref="Tag"/> with the requested <paramref name="id"/> and returns it.
        /// </summary>
        /// <param name="id">ID of the requested item.</param>
        /// <returns><see cref="OkObjectResult"/> with requested <see cref="Tag"/>. <see cref="NotFoundObjectResult"/> with <paramref name="id"/>, if not found.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var item = await _db.Tags.FindAsync(id);
            if (item != null)
            {
                _logger.LogDebug("Requested a tag with ID: {id}.", id);
                return Ok(item);
            }
            else
            {
                _logger.LogWarning("Could not find a tag with ID: {id}.", id);
                return NotFound(id);
            }
        }

    }
}
