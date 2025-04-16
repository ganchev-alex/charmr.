import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { colors } from "../../../../utility/colors";
import { Message } from "../../../../utility/interfaces/data_types";
import { formatMessageTimestamp } from "../../../../utility/functions/date_formating";

const CoreInterlocutorMessage: React.FC<{
  messagePayload: Message;
  profileSource: string;
  isNewestInSequence: boolean;
  shouldShowTimestamp: boolean;
  shouldShowReadTime: boolean;
  onOpenDeleteModal: React.Dispatch<
    React.SetStateAction<{
      visibility: boolean;
      messageId: string;
      recipientId: string;
    }>
  >;
}> = function ({
  messagePayload,
  profileSource,
  isNewestInSequence,
  shouldShowTimestamp,
  shouldShowReadTime,
  onOpenDeleteModal,
}) {
  return (
    <Pressable
      style={styles.container}
      onLongPress={() =>
        onOpenDeleteModal({
          visibility: true,
          messageId: messagePayload.id,
          recipientId: messagePayload.recipientId,
        })
      }
    >
      <View style={styles.message_wrapper}>
        <Text
          style={[
            styles.message,
            messagePayload.isDeletedBySender && {
              fontFamily: "hn_italic",
              color: colors.extraLightGrey,
              paddingBottom: "4%",
            },
          ]}
        >
          {messagePayload.isDeletedBySender
            ? "Message was deleted."
            : messagePayload.content}
        </Text>
        <View style={styles.timestamps}>
          {shouldShowTimestamp && (
            <Text style={styles.timestamp}>
              {formatMessageTimestamp(messagePayload.messageSent)}
            </Text>
          )}
          {shouldShowReadTime && (
            <>
              <Icon
                name="checkmark-done-outline"
                color={
                  messagePayload.isRead ? colors.primary : colors.textSecondary
                }
                size={19.5}
                style={{ marginLeft: 10, marginRight: 2.5 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: messagePayload.isRead
                    ? colors.primary
                    : colors.textSecondaryContrast,
                }}
              >
                {messagePayload.isRead
                  ? "Seen: " + formatMessageTimestamp(messagePayload.dateRead)
                  : "Delivered"}
              </Text>
            </>
          )}
        </View>
      </View>
      {isNewestInSequence && (
        <Image source={{ uri: profileSource }} style={styles.profile} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    width: "75%",
    alignItems: "flex-end",
    gap: "3.5%",
    alignSelf: "flex-end",
  },
  message_wrapper: {
    width: "82%",
  },
  message: {
    backgroundColor: colors.primary,
    color: colors.secondaryBackground,
    fontFamily: "hn_medium",
    fontSize: 16.5,
    lineHeight: 19.5,
    padding: "7.5%",
    borderRadius: 25,
    borderBottomRightRadius: 10,
    elevation: 5,
  },
  profile: {
    width: "14.5%",
    aspectRatio: 1 / 1,
    borderRadius: 100,
    elevation: 5,
    marginBottom: 24,
  },
  timestamps: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontFamily: "hn_regular",
    alignSelf: "flex-end",
    fontSize: 13,
    color: colors.textSecondaryContrast,
  },
});

export default CoreInterlocutorMessage;
