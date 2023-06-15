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

        /// <summary>
        /// Return all <see cref="Tag"/>s from the database ordered by name.
        /// </summary>
        /// <returns><see cref="IAsyncEnumerable{Tag}"/> ordered by name.</returns>
        [HttpGet]
        public IAsyncEnumerable<Tag> GetAll()
        {
            return _db.Tags.OrderBy(tag => tag.Name).AsAsyncEnumerable();
        }

        /// <summary>
        /// Creates a <see cref="Tag"/> in the database. Requires authorization.
        /// </summary>
        /// <param name="item"><see cref="Tag"/> to be added.</param>
        /// <returns><see cref="OkObjectResult"/> with added <see cref="Tag"/>.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Tag))]
        public async Task<IActionResult> AddAsync([FromBody] Tag item)
        {
            await _db.AddAsync(item);
            await _db.SaveChangesAsync();
            _logger.LogDebug("Added a tag with ID: {id}.", item.Id);
            return Ok(item);
        }

        /// <summary>
        /// Deletes a <see cref="Tag"/> with the requested <paramref name="id"/>. Requires authorization.
        /// </summary>
        /// <param name="id">ID of the tag that is to be deleted.</param>
        /// <returns><see cref="OkObjectResult"/> with the deleted <see cref="Tag"/>. <see cref="NotFoundObjectResult"/> with <paramref name="id"/> if not found.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Tag))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(int))]
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
        /// Edits a <see cref="Tag"/>. Requires authorization.
        /// </summary>
        /// <param name="tag">Instance of a <see cref="Tag"/> with a valid ID.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="Tag"/> after edits. <see cref="NotFoundObjectResult"/> with <paramref name="tag"/>, if ID not found in the database.</returns>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Tag))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(Tag))]
        public async Task<IActionResult> EditAsync([FromBody] Tag tag)
        {
            if (await _db.Tags.AnyAsync(dbTag => dbTag.Id == tag.Id))
            {
                _db.Update(tag);
                await _db.SaveChangesAsync();
                _logger.LogDebug("Edited a tag with ID: {id}.", tag.Id);
                return Ok(tag);
            }
            else
            {
                _logger.LogWarning("Could not edit a tag with ID: {id}.", tag.Id);
                return NotFound(tag);
            }
        }

    }
}
