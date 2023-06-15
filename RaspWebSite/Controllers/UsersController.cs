using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaspWebSite.Models;
using RaspWebSite.Services;

namespace RaspWebSite.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly ILogger<UsersController> _logger;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly TokenService _tokenService;

        public UsersController(ILogger<UsersController> logger, UserManager<IdentityUser> userManager, TokenService tokenService)
        {
            _logger = logger;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT.
        /// </summary>
        /// <param name="userDTO">Login information.</param>
        /// <returns><see cref="OkObjectResult"/> with <see cref="TokenDTO"/> or <see cref="UnauthorizedResult"/></returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TokenDTO))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDTO userDTO)
        {
            var user = await _userManager.FindByNameAsync(userDTO.UserName);
            if (user != null)
            {
                if (await _userManager.CheckPasswordAsync(user, userDTO.Password))
                {
                    return Ok(new TokenDTO { Token = _tokenService.CreateToken(user), });
                }
            }

            _logger.LogWarning("Login attempt failed from: {clientAddress}.",
                Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "null");
            return Unauthorized();
        }

        /// <summary>
        /// Registers a new user. Requires authorization.
        /// </summary>
        /// <param name="userDTO">User information used to create a new account.</param>
        /// <returns><see cref="OkResult"/> if user created, otherwise <see cref="BadRequestObjectResult"/> with <see cref="IEnumerable{IdentityError}"/> of <see cref="IdentityError"/>.</returns>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IEnumerable<IdentityError>))]
        public async Task<IActionResult> RegisterAsync([FromBody] LoginDTO userDTO)
        {
            var usrStatus = await _userManager.CreateAsync(new IdentityUser(userDTO.UserName), userDTO.Password);
            if (usrStatus.Succeeded)
                return Ok();
            else
                return BadRequest(usrStatus.Errors);
        }

        /// <summary>
        /// Executes <see cref="Register(LoginDTO)"/> without authorization if there is no account in the database.
        /// </summary>
        /// <param name="userDTO">User information used to create a new account.</param>
        /// <returns><see cref="UnauthorizedResult"/> if there is an account, otherwise check <see cref="Register(LoginDTO)"/>.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IEnumerable<IdentityError>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> FirstRun([FromBody] LoginDTO userDTO)
        {
            if (_userManager.Users.Any()) return Unauthorized();
            else return await RegisterAsync(userDTO);
        }

        /// <summary>
        /// Returns <see cref="OkResult"/>. Requires authorization. Use to check if user's session is valid.
        /// </summary>
        /// <returns><see cref="OkResult"/></returns>
        [Authorize]
        [HttpGet]
        public OkResult Ping() => Ok();

        [Authorize]
        [HttpGet]
        public IAsyncEnumerable<UserDTO> GetAll()
        {
            return _userManager.Users.Select(user => new UserDTO { Id = user.Id, Name = user.UserName ?? "UNKNOWN" }).AsAsyncEnumerable();
        }

    }
}
