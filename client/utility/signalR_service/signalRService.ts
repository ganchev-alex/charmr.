import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { API_ROOT } from "../../App";
import {
  threadPaginationParamsInitializier,
  messageThreadInitializer,
  newMessageAppender,
  onlineUserAppender,
  onlineUserRemover,
  onlineUsersSaver,
  seenMarker,
  messageDeletionSetter,
} from "../store/slices/signalR";

class SignalRService {
  private presenceHubConnection: HubConnection | null = null;
  private messageHubConnection: HubConnection | null = null;
  private dispatch: Function;

  constructor(dispatch: Function) {
    this.dispatch = dispatch;
  }

  initPressenceHub(token: string) {
    this.presenceHubConnection = new HubConnectionBuilder()
      .withUrl(`${API_ROOT}/hubs/presence`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this._startPressenceHubConnection();

    this.presenceHubConnection.on("UserIsOnline", (userId) => {
      this.dispatch(onlineUserAppender(userId));
    });

    this.presenceHubConnection.on("UserIsOffline", (userId) => {
      this.dispatch(onlineUserRemover(userId));
    });

    this.presenceHubConnection.on("GetOnlineUsers", (users) => {
      this.dispatch(onlineUsersSaver(users));
    });
  }

  initMessageHub(
    interlocutorId: string,
    token: string,
    onSetLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
    pageIndex: number = 1,
    pageSize: number = 25
  ) {
    this.messageHubConnection = new HubConnectionBuilder()
      .withUrl(
        `${API_ROOT}/hubs/message?userId=${interlocutorId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        {
          accessTokenFactory: () => token,
        }
      )
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this._startMessageHubConnection(onSetLoadingState);

    this.messageHubConnection.on("newMessage", (message) => {
      this.dispatch(newMessageAppender(message));
    });

    this.messageHubConnection.on("receiveMessageThread", (messages) => {
      this.dispatch(messageThreadInitializer(messages));
    });

    this.messageHubConnection.on("newMessageReceived", (message) => {
      this.dispatch(newMessageAppender(message));
    });

    this.messageHubConnection.on(
      "interlocutorEnteredChat",
      (interlocutorId) => {
        this.dispatch(seenMarker(interlocutorId));
      }
    );

    this.messageHubConnection.on(
      "deletionMessageReceived",
      (messageToDelete) => {
        this.dispatch(messageDeletionSetter(messageToDelete.id));
      }
    );

    this.messageHubConnection.on("deletedMessage", (deletedMessage) => {
      this.dispatch(messageDeletionSetter(deletedMessage.id));
    });
  }

  sendMessage(recipientId: string, messageContent: string) {
    if (this.messageHubConnection) {
      this.messageHubConnection.invoke("SendMessage", {
        recipientId,
        messageContent,
      });
    } else {
      console.log("SignalR connection is not established.");
    }
  }

  deleteMessage(messageId: string, recipientId: string) {
    if (this.messageHubConnection) {
      this.messageHubConnection.invoke("DeleteMessage", {
        messageId,
        recipientId,
      });
    } else {
      console.log("SignalR connection is not established.");
    }
  }

  terminatePresenceHub() {
    if (this.presenceHubConnection) {
      this.presenceHubConnection.stop();
    }
  }

  terminateMessageHub() {
    if (this.messageHubConnection) {
      console.log("Message Hub Terminated");
      this.messageHubConnection.stop();
      this.dispatch(threadPaginationParamsInitializier());
    }
  }

  private async _startPressenceHubConnection() {
    try {
      await this.presenceHubConnection?.start();
      console.log(
        "Connection to the Precence Service was established successfully."
      );
    } catch (error) {
      console.log("Couldn't connect to the Precence Service.\nError: ", error);
    }
  }

  private async _startMessageHubConnection(
    onSetLoadingState: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    try {
      onSetLoadingState(true);
      await this.messageHubConnection?.start();
      console.log(
        "Connection to the Message Service was established successfully."
      );
    } catch (error) {
      console.log("Couldn't connect to the Message Service.\nError: ", error);
    } finally {
      onSetLoadingState(false);
    }
  }
}

export default SignalRService;
