using Microsoft.AspNetCore.SignalR;
using Server.DataAccess.DataTransferObjects.Messages;
using Server.DataAccess.Repository;
using Server.Utility;

namespace Server.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IHubContext<PresenceHub> _pressenceHub;
        private readonly PresenceTracker _tracker;
        private readonly IUnitOfWork _unit;

        public MessageHub(IHubContext<PresenceHub> pressenceHub, PresenceTracker tracker, IUnitOfWork unit)
        {
            _pressenceHub = pressenceHub;
            _tracker = tracker;
            _unit = unit;
        }

        public override async Task OnConnectedAsync()
        {
            var coreInterlocutor = Context.User?.ExtractUserId();

            if(coreInterlocutor == null)
            {
                return;
            }

            var httpContext = Context.GetHttpContext();
            var otherInterlocutor = httpContext?.Request.Query["userId"].ToString();
            var pageIndex = httpContext?.Request.Query["pageIndex"].ToString();
            var pageSize = httpContext?.Request.Query["pageSize"].ToString();

            var groupIdentifier = ComposeGroupName((Guid)coreInterlocutor, Guid.Parse(otherInterlocutor));
            await Groups.AddToGroupAsync(Context.ConnectionId, groupIdentifier);
            var group = await AddToMessageGroup(groupIdentifier, (Guid)coreInterlocutor);
            await Clients.OthersInGroup(groupIdentifier).SendAsync("InterlocutorEnteredChat", coreInterlocutor);

            var messages = await _unit.messageRepository.GetMessageThread((Guid)coreInterlocutor, Guid.Parse(otherInterlocutor), int.Parse(pageIndex), int.Parse(pageSize));

            var unreadMessages = messages
                .Where(m => m.RecipientId == coreInterlocutor && !m.isRead)
                .ToList();

            foreach(var message in unreadMessages)
            {
                message.isRead = true;
                message.DateRead = DateTime.UtcNow;

                _unit.messageRepository.Update(message);
            }

            await _unit.SaveTransaction();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(SentMessagePayload sentMessage)
        {
            var senderId = Context.User?.ExtractUserId();

            if (senderId == null)
            {
                return;
            }

            var message = new Models.Message
            {
                Id = new Guid(),
                SenderId = (Guid)senderId,
                RecipientId = sentMessage.RecipientId,
                Content = sentMessage.MessageContent,
                isRead = false,
                DateRead = null,
                MessageSent = DateTime.UtcNow,
                IsDeletedBySender = false
            };

            _unit.messageRepository.Add(message);

            var groupIdentifier = ComposeGroupName((Guid)senderId, sentMessage.RecipientId);
            var group = await _unit.groupRepository.Get(g => g.Identifier == groupIdentifier, "Connections");

            if(group == null)
            {
                return;
            }

            if(group.Connections.Any(g => g.UserId == sentMessage.RecipientId))
            {
                message.isRead = true;
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await _tracker.GetUserConnections(sentMessage.RecipientId);
                if(connections != null)
                {
                    await _pressenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message);
                }
            }

            await _unit.SaveTransaction();
            await Clients.Group(groupIdentifier).SendAsync("NewMessage", message);
        }

        public async Task DeleteMessage(DeleteMessagePayload deletedMessage)
        {
            var senderId = Context.User?.ExtractUserId();

            if (senderId == null)
            {
                return;
            }

            var messageToDelete = await _unit.messageRepository.Get(mess => mess.Id == deletedMessage.MessageId);

            if (messageToDelete == null) return;

            messageToDelete.IsDeletedBySender = true;
            _unit.messageRepository.Update(messageToDelete);

            var groupIdentifier = ComposeGroupName((Guid)senderId, deletedMessage.RecipientId);
            var group = await _unit.groupRepository.Get(g => g.Identifier == groupIdentifier, "Connections");

            if (group == null)
            {
                return;
            }

            if (!group.Connections.Any(g => g.UserId == deletedMessage.RecipientId))
            {
                var connections = await _tracker.GetUserConnections(deletedMessage.RecipientId);
                if (connections != null)
                {
                    await _pressenceHub.Clients.Clients(connections).SendAsync("DeletionMessageReceived", messageToDelete);
                }
            }

            await _unit.SaveTransaction();
            await Clients.Group(groupIdentifier).SendAsync("DeletedMessage", messageToDelete);
        }

        private async Task<Models.Group> AddToMessageGroup(string groupIdentifier, Guid coreInterlocutor)
        {
            var group = await _unit.groupRepository.Get(g => g.Identifier == groupIdentifier);
            var connection = new Models.Connection(Context.ConnectionId, coreInterlocutor);

            if(group == null)
            {
                group = new Models.Group(groupIdentifier);
                _unit.groupRepository.Add(group);
            }

            connection.GroupIdentifier = group.Identifier;
            _unit.connectionRepository.Add(connection);
            group.Connections.Add(connection);

            await _unit.SaveTransaction();
            return group;

            throw new HubException("Failed to join the identification group.");
        }

        private async Task<Models.Group?> RemoveFromMessageGroup()
        {
            var group = await _unit.groupRepository.GetGroupForConnection(Context.ConnectionId);

            if (group != null)
            {
                var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
                _unit.connectionRepository.Delete(connection);
            }

            await _unit.SaveTransaction();

            return group;

            throw new HubException("Failed to remove from group");
        }

        private string ComposeGroupName(Guid coreId, Guid otherId)
        {
            return coreId.CompareTo(otherId) < 0 ? $"{coreId}:{otherId}" : $"{otherId}:{coreId}";
        }
    }
}
