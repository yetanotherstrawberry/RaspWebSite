using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaspWebSite.Models;

namespace RaspWebSite.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class VisitsController : ControllerBase
    {

        private readonly AppDbContext _db;
        private readonly ILogger<VisitsController> _logger;

        public VisitsController(AppDbContext context, ILogger<VisitsController> logger)
        {
            _db = context;
            _logger = logger;
        }

        /// <summary>
        /// Registers or updates a <see cref="Visitor"/>.
        /// </summary>
        /// <returns><see cref="Visitor"/> that viewed the page.</returns>
        [HttpGet]
        public async Task<Visitor> VisitedAsync()
        {
            var ipBehindProxy = Request.Headers["X-Forwarded-For"].ToString();
            // connIp may be null, if the controller is accessed by unit tests.
            var connIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "null";
            var currentAddress = string.IsNullOrEmpty(ipBehindProxy) ? connIp : ipBehindProxy;
            var dbAddress = await _db.Visitors.SingleOrDefaultAsync(visitor => visitor.IP == currentAddress);
            if (dbAddress == null)
            {
                _logger.LogDebug("New visitor: {visitorAddress}", currentAddress);
                dbAddress = new Visitor
                {
                    IP = currentAddress,
                };
                await _db.Visitors.AddAsync(dbAddress);
            }
            else _logger.LogDebug("Known visitor: {visitorAddress}", currentAddress);

            if (dbAddress.Visits < int.MaxValue) dbAddress.Visits++;
            else _logger.LogWarning("Visitor {visitorAddress} reached maximum number of visits.", currentAddress);

            dbAddress.LastVisit = DateTime.Now;

            await _db.SaveChangesAsync();
            return dbAddress;
        }

        /// <summary>
        /// Shows all <see cref="Visitor"/>s recorded in the database. Requires authorization.
        /// </summary>
        /// <returns>Enumeration of all <see cref="Visitor"/>s.</returns>
        [HttpGet]
        [Authorize]
        public IAsyncEnumerable<Visitor> GetVisitors()
        {
            _logger.LogDebug("Requested all visitors.");
            return _db.Visitors.OrderBy(visit => visit.LastVisit).AsAsyncEnumerable();
        }

        /// <summary>
        /// Removes all rows from the table of <see cref="Visitor"/>s.
        /// </summary>
        /// <returns><see cref="OkObjectResult"/> with <see cref="int"/> of removed rows or <see cref="NoContentResult"/> if no table found.</returns>
        [HttpDelete]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(int))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> ClearAsync()
        {
            _logger.LogDebug("Received request to clear all visitors.");
            var tableName = _db.Model.FindEntityType(typeof(Visitor))?.GetTableName();
            if (string.IsNullOrEmpty(tableName)) return NoContent();
            else return Ok(await _db.Database.ExecuteSqlRawAsync("TRUNCATE TABLE " + tableName));
        }

    }
}
