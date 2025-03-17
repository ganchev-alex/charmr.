using System.Security.Claims;

namespace Server.Utility
{
    public static class ClaimPrincipleExtension
    {
        public static Guid? ExtractUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst("NameId")?.Value?.ToUpper();

            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out Guid userId))
            {
                return userId;
            }

            return null;
        }
    }
}
