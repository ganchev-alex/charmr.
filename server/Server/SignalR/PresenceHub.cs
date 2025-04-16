using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Server.Utility;

namespace Server.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.ExtractUserId();

            if(userId == null)
            {
                return;
            }

            var isOnline = await _tracker.UserConnected((Guid)userId, Context.ConnectionId);

            if(isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", userId);
            }

            var onlineUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", onlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User?.ExtractUserId();

            if (userId == null)
            {
                await base.OnDisconnectedAsync(exception);
                return;
            }

            var isOffline = await _tracker.UserDisconnected((Guid)userId, Context.ConnectionId);

            if(isOffline)
            {
                await Clients.Others.SendAsync("UserIsOffline", userId);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
