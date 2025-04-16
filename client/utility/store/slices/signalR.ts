import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../interfaces/data_types";

interface ISignalRDataState {
  onlineUsers: string[];
  recipientDetails: {
    recipientId: string;
    fullname: string;
    age: number;
    profilePic: string;
  };
  messageThread: Message[];
  threadPaginationParams: {
    pageIndex: number;
    pageSize: number;
    hasReachedEnd: boolean;
  };
}

const initialState: ISignalRDataState = {
  onlineUsers: [],
  recipientDetails: {
    recipientId: "",
    fullname: "",
    age: 18,
    profilePic: "",
  },
  messageThread: [],
  threadPaginationParams: {
    pageIndex: 2,
    pageSize: 25,
    hasReachedEnd: false,
  },
};

const signalRDataManagementSlice = createSlice({
  name: "signalR_data_management",
  initialState,
  reducers: {
    onlineUsersSaver: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    onlineUserAppender: (state, action: PayloadAction<string>) => {
      state.onlineUsers.push(action.payload);
    },
    onlineUserRemover: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (onlineUser) => onlineUser !== action.payload
      );
    },
    recipientDetailsInitializer: (
      state,
      action: PayloadAction<ISignalRDataState["recipientDetails"]>
    ) => {
      state.recipientDetails = action.payload;
    },
    messageThreadInitializer: (state, action: PayloadAction<Message[]>) => {
      state.messageThread = action.payload;
    },
    newMessageAppender: (state, action: PayloadAction<Message>) => {
      state.messageThread = [action.payload, ...state.messageThread];
    },
    messageThreadContinnuer: (state, action: PayloadAction<Message[]>) => {
      if (action.payload.length > 0) {
        state.messageThread = [
          ...state.messageThread,
          ...action.payload.filter(
            (m) => !state.messageThread.some((existing) => existing.id === m.id)
          ),
        ];
        state.threadPaginationParams.pageIndex += 1;
      } else {
        state.threadPaginationParams.hasReachedEnd = true;
      }
    },
    threadPaginationParamsInitializier: (state) => {
      state.threadPaginationParams = { ...initialState.threadPaginationParams };
    },
    seenMarker: (state, action: PayloadAction<string>) => {
      if (
        state.messageThread[0].senderId != action.payload &&
        !state.messageThread[0].isRead
      ) {
        state.messageThread[0].isRead = true;
        state.messageThread[0].dateRead = new Date().toISOString();
      }
    },
    messageDeletionSetter: (state, action: PayloadAction<string>) => {
      const targetedMessage = state.messageThread.find(
        (message) => message.id == action.payload
      );

      if (targetedMessage) {
        targetedMessage.isDeletedBySender = true;
      }
    },
    chatStateCleaner: (state) => {
      state.recipientDetails = initialState.recipientDetails;
      state.messageThread = initialState.messageThread;
      state.threadPaginationParams = initialState.threadPaginationParams;
    },
  },
});

export const {
  onlineUsersSaver,
  onlineUserAppender,
  onlineUserRemover,
  recipientDetailsInitializer,
  messageThreadInitializer,
  newMessageAppender,
  messageThreadContinnuer,
  threadPaginationParamsInitializier,
  seenMarker,
  messageDeletionSetter,
  chatStateCleaner,
} = signalRDataManagementSlice.actions;
export default signalRDataManagementSlice.reducer;
