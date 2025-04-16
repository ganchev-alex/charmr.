using Server.Models;

namespace Server.Services.Abstraction
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
