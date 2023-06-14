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
        /// Registers a visit.
        /// </summary>
        /// <returns><see cref="Visitor"/></returns>
        [HttpGet]
        public async Task<Visitor> Visited()
        {
            // RemoteIpAddress may be null, if the controller is accessed by unit tests.
            var currentAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "null";
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
        /// Shows all visitors recorded in the database. Requires authorization.
        /// </summary>
        /// <returns>Enumeration of all <see cref="Visitor"/>s.</returns>
        [HttpGet]
        [Authorize]
        public IAsyncEnumerable<Visitor> GetVisitors()
        {
            _logger.LogDebug("Requested all visitors.");
            return _db.Visitors.OrderBy(visit => visit.LastVisit).AsAsyncEnumerable();
        }

    }
}
