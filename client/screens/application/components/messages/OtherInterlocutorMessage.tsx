import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { Message } from "../../../../utility/interfaces/data_types";
import { formatMessageTimestamp } from "../../../../utility/functions/date_formating";

const OtherInterlocutorMessage: React.FC<{
  messagePayload: Message;
  profileSource: string;
  isNewestInSequence: boolean;
  shouldShowTimestamp: boolean;
}> = function ({
  messagePayload,
  profileSource,
  isNewestInSequence,
  shouldShowTimestamp,
}) {
  return (
    <View style={styles.container}>
      {isNewestInSequence && (
        <Image source={{ uri: profileSource }} style={styles.profile} />
      )}
      <View style={styles.message_wrapper}>
        <Text
          style={[
            styles.message,
            messagePayload.isDeletedBySender && {
              fontFamily: "hn_italic",
              color: colors.textSecondary,
              paddingBottom: "4%",
            },
          ]}
        >
          {messagePayload.isDeletedBySender
            ? "Message was deleted."
            : messagePayload.content}
        </Text>
        {shouldShowTimestamp && (
          <Text style={styles.timestamp}>
            {formatMessageTimestamp(messagePayload.messageSent)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    width: "75%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: "3.5%",
    alignSelf: "flex-start",
  },
  message_wrapper: {
    width: "82%",
  },
  message: {
    backgroundColor: colors.secondaryBackground,
    color: colors.textPrimary,
    fontFamily: "hn_medium",
    fontSize: 16.5,
    lineHeight: 19.5,
    padding: "7.5%",
    borderRadius: 25,
    borderBottomLeftRadius: 10,
    elevation: 5,
  },
  profile: {
    width: "14.5%",
    aspectRatio: 1 / 1,
    borderRadius: 100,
    elevation: 5,
    marginBottom: 24,
  },
  timestamp: {
    fontFamily: "hn_regular",
    alignSelf: "flex-start",
    fontSize: 13,
    marginTop: 4,
    color: colors.textSecondaryContrast,
  },
});

export default OtherInterlocutorMessage;
