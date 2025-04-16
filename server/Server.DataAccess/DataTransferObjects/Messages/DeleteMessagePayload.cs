namespace Server.DataAccess.DataTransferObjects.Messages
{
    public class DeleteMessagePayload
    {
        public Guid MessageId { get; set; }
        public Guid RecipientId { get; set; }
    }
}
