using Microsoft.AspNetCore.Identity;

namespace RaspWebSite.Interfaces
{
    internal interface IJWTTokenGen
    {

        public string CreateToken<T>(IdentityUser<T> user) where T : IEquatable<T>;

    }
}
