using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccess.Database;
using Server.DataAccess.DataTransferObjects.Messages;
using Server.DataAccess.Repository;
using Server.Models;
using Server.Utility;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly UnitOfWork _unit;

        public MessagesController(ApplicationDBContext context)
        {
            _unit = new UnitOfWork(context);
        }

        [Authorize]
        [HttpGet("chats")]
        public async Task<ActionResult<ChatDetails[]>> Chats()
        {
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var allMessages = await _unit.messageRepository.GetAll(m => m.SenderId == userId || m.RecipientId == userId, includeProperties: "Sender,Recipient");

            var latestMessages = allMessages.GroupBy(m => m.SenderId == userId ? m.RecipientId : m.SenderId)
                .Select(g => new
                {
                    LatestMessage = g.OrderByDescending(m => m.MessageSent).FirstOrDefault(),
                    UnreadCount = g.Count(m => m.RecipientId == userId && !m.isRead) 
                })
                .Select(g => new ChatDetails
                {
                    InterlocutorId = g.LatestMessage.SenderId == userId ? g.LatestMessage.RecipientId : g.LatestMessage.SenderId,
                    IntelocutorName = g.LatestMessage.SenderId == userId ? g.LatestMessage.Recipient.FullName : g.LatestMessage.Sender.FullName,
                    LastMessageContent = g.LatestMessage.Content,
                    LastMessageTimestamp = g.LatestMessage.MessageSent,
                    NewMessagesCount = g.UnreadCount 
                })
                .OrderByDescending(m => m.LastMessageTimestamp)
                .ToList();

            if (latestMessages == null || !latestMessages.Any())
            {
                return Ok(new { chats = new ChatDetails[0] });
            }

            foreach (var message in latestMessages)
            {
                message.InterlocutorProfilePic = (await _unit.photoRepository.Get(p => p.isMain && p.UserId == message.InterlocutorId))?.Url ?? "";
            }

            return Ok(new { chats = latestMessages });
        }

        [Authorize]
        [HttpGet("recipient-details")]
        public async Task<ActionResult<RecipientDetails>> LoadRecipientDetails([FromQuery] Guid recipientId)
        {
            var userId = User.ExtractUserId();

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _unit.userRepository.Get(u => u.Id == recipientId, "Details,Photos");

            if (user == null)
            {
                return NotFound();
            }

            var recipientDetials = new RecipientDetails
            {
                RecipientId = user.Id,
                Fullname = user.FullName,
                Age = user.CalculateAge(),
                ProfilePic = user.Photos.Where(p => p.isMain).FirstOrDefault()?.Url ?? "",
            };

            return Ok(recipientDetials);
        }

        [Authorize]
        [HttpPost("thread-continuer")]
        public async Task<ActionResult<List<Message>>> ContinueMessageThread([FromBody] MessageThreadParams threadParams)
        {
            var coreInterlocutorId = User.ExtractUserId();

            if (coreInterlocutorId == null)
            {
                return Unauthorized();
            }

            var messages = await _unit.messageRepository.GetMessageThread((Guid)coreInterlocutorId, threadParams.InterlocutorId, threadParams.pageIndex, threadParams.pageSize);

            return Ok(messages);
        }
    }
}
