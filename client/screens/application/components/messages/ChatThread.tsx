import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import CoreInterlocutorMessage from "./CoreInterlocutorMessage";
import OtherInterlocutorMessage from "./OtherInterlocutorMessage";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { colors } from "../../../../utility/colors";
import { useState } from "react";

import { API_ROOT } from "../../../../App";
import { Message } from "../../../../utility/interfaces/data_types";
import { messageThreadContinnuer } from "../../../../utility/store/slices/signalR";

const TIMESTAMP_GROUPING_THRESHOLD_MINUTES = 5;
const TIMESTAMP_THRESHOLD_MS = TIMESTAMP_GROUPING_THRESHOLD_MINUTES * 60 * 1000;

const ChatThread: React.FC<{
  threadRef: React.RefObject<FlatList<any>>;
  onOpenDeleteModal: React.Dispatch<
    React.SetStateAction<{
      visibility: boolean;
      messageId: string;
      recipientId: string;
    }>
  >;
}> = function ({ threadRef, onOpenDeleteModal }) {
  const dispatch = useCharmrDispatch();
  const { token } = useCharmrSelector((state) => state.authentication);
  const { messageThread, threadPaginationParams } = useCharmrSelector(
    (state) => state.signalRDataManager
  );
  const { recipientId, profilePic } = useCharmrSelector(
    (state) => state.signalRDataManager.recipientDetails
  );
  const { profilePicture } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData
  );
  const [loadingState, setLoadingState] = useState(false);

  const onScrollHandler = async (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    if (
      contentOffset.y >= contentSize.height - layoutMeasurement.height - 15 &&
      messageThread.length >= 25 &&
      !threadPaginationParams.hasReachedEnd &&
      !loadingState
    ) {
      try {
        setLoadingState(true);
        const response = await fetch(`${API_ROOT}/messages/thread-continuer`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interlocutorId: recipientId,
            pageIndex: threadPaginationParams.pageIndex,
            pageSize: threadPaginationParams.pageSize,
          }),
        });

        if (response.ok) {
          const responseData: Message[] = await response.json();
          dispatch(messageThreadContinnuer(responseData));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  return messageThread.length == 0 ? (
    <View style={styles.init_view}>
      <LottieView
        source={require("../../../../assets/animations/messageAnimation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Break the Ice & Make a Connection!</Text>
      <Text style={styles.greeting_message}>
        Start your conversation with a spark! Whether it’s a fun fact, a playful
        question, or a simple “Hey there,” a great opening message can lead to
        something amazing. Be yourself, be kind, and enjoy getting to know
        someone new!
      </Text>
    </View>
  ) : (
    <FlatList
      ref={threadRef}
      onScroll={onScrollHandler}
      scrollEventThrottle={16}
      style={styles.thread}
      contentContainerStyle={{
        gap: 10,
        justifyContent: "flex-end",
        flexGrow: 1,
      }}
      inverted
      data={messageThread}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const nextNewerMessageIndex = index - 1;
        const nextNewerMessage =
          nextNewerMessageIndex >= 0
            ? messageThread[nextNewerMessageIndex]
            : null;

        const isNewestInSequence =
          !nextNewerMessage || nextNewerMessage.senderId !== item.senderId;

        let shouldShowTimestamp = false;
        if (isNewestInSequence) {
          shouldShowTimestamp = true;
        } else {
          if (nextNewerMessage) {
            try {
              const currentTimestamp = new Date(item.messageSent).getTime();
              const nextNewerTimestamp = new Date(
                nextNewerMessage.messageSent
              ).getTime();

              if (
                nextNewerTimestamp - currentTimestamp >=
                TIMESTAMP_THRESHOLD_MS
              ) {
                shouldShowTimestamp = true;
              }
            } catch (e) {
              console.error("Error parsing message timestamps:", e);
              shouldShowTimestamp = true;
            }
          } else {
            shouldShowTimestamp = true;
          }
        }

        if (item.senderId == recipientId) {
          return (
            <OtherInterlocutorMessage
              messagePayload={item}
              profileSource={profilePic}
              isNewestInSequence={isNewestInSequence}
              shouldShowTimestamp={shouldShowTimestamp}
            />
          );
        } else {
          return (
            <CoreInterlocutorMessage
              messagePayload={item}
              profileSource={profilePicture.url}
              isNewestInSequence={isNewestInSequence}
              shouldShowTimestamp={shouldShowTimestamp}
              shouldShowReadTime={index === 0}
              onOpenDeleteModal={onOpenDeleteModal}
            />
          );
        }
      }}
      ListHeaderComponent={<View style={{ height: 5 }} />}
      ListFooterComponent={
        <View
          style={{
            height: threadPaginationParams.hasReachedEnd ? 15 : 70,
            width: "100%",
            borderRadius: 50,
            overflow: "hidden",
            marginTop: 15,
            justifyContent: "center",
          }}
        >
          {loadingState && (
            <LottieView
              source={require("../../../../assets/animations/primeAnimationLoader.json")}
              style={{ alignSelf: "center", width: 75, height: 75 }}
              autoPlay
              loop
              speed={1.5}
            />
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  init_view: {
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  animation: {
    width: "125%",
    aspectRatio: 1 / 1,
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 26,
    textAlign: "center",
    color: colors.primary,
    marginTop: "-25%",
  },
  greeting_message: {
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    textAlign: "center",
    fontSize: 17,
    marginTop: 15,
    lineHeight: 18,
  },
  thread: {
    paddingVertical: "2.5%",
    paddingHorizontal: "4%",
  },
});

export default ChatThread;
