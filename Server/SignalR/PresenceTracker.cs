namespace Server.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<Guid, List<string>> OnlineUsers = new Dictionary<Guid, List<string>>();

        public Task<bool> UserConnected(Guid userId, string connectionId)
        {
            bool isOnline = false;
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(userId))
                {
                    OnlineUsers[userId].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(userId, new List<string> { connectionId });
                    isOnline = true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(Guid userId, string connectionId)
        {
            bool isOffline = false;
            lock (OnlineUsers)
            {
                if(!OnlineUsers.ContainsKey(userId))
                {
                    return Task.FromResult(isOffline);
                }

                OnlineUsers[userId].Remove(connectionId);

                if (OnlineUsers[userId].Count == 0)
                {
                    OnlineUsers.Remove(userId);
                    isOffline = true;
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<Guid[]> GetOnlineUsers()
        {
            Guid[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.Select(kvp => kvp.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>> GetUserConnections(Guid userId)
        {
            List<string> connectionIds;
            lock(OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(userId) ?? new List<string>();
            }

            return Task.FromResult(connectionIds);
        }
    }
}
