export type SwipeCardData = {
  userId: string;
  name: string;
  age: number;
  about: string;
  distance: number;
  normalizedLocation: string;
  profilePicture: string;
};

export type LikeCard = {
  userId: string;
  name: string;
  age: number;
  distance: number;
  profilePicture: string;
  isSuperLike: boolean;
  likedOn: Date;
};

export type Match = {
  matchedUserId: string;
  username: string;
  profilePicture: string;
};

export type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  dateRead: string;
  messageSent: string;
  isDeletedBySender: boolean;
};

export type ChatDetails = {
  interlocutorId: string;
  intelocutorName: string;
  interlocutorProfilePic: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  newMessagesCount: number;
};
