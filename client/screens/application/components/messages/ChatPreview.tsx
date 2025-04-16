import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../../utility/colors";
import { ChatDetails } from "../../../../utility/interfaces/data_types";
import { formatTimestampForNotification } from "../../../../utility/functions/date_formating";
import { useCharmrSelector } from "../../../../utility/store/store";

const ChatPreview: React.FC<{ payload: ChatDetails }> = function ({ payload }) {
  const navigation = useNavigation();
  const { onlineUsers } = useCharmrSelector(
    (state) => state.signalRDataManager
  );

  return (
    <Pressable
      style={style.container}
      onPress={() =>
        navigation
          .getParent()
          ?.navigate("chat", { userId: payload.interlocutorId })
      }
    >
      <View style={style.profile_wrapper}>
        <Image
          source={{ uri: payload.interlocutorProfilePic }}
          style={style.profile}
        />
        {onlineUsers.includes(payload.interlocutorId) && (
          <View style={style.active_dot} />
        )}
      </View>
      <View style={{ width: "62.5%" }}>
        <Text style={style.name}>{payload.intelocutorName}</Text>
        <Text style={[style.message]} numberOfLines={2} ellipsizeMode="tail">
          {payload.lastMessageContent}
        </Text>
      </View>
      <View style={style.notification_container}>
        <Text style={style.timestamp}>
          {formatTimestampForNotification(payload.lastMessageTimestamp)}
        </Text>
        {payload.newMessagesCount > 0 && (
          <Text style={style.notification}>{payload.newMessagesCount}</Text>
        )}
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "91%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "6.5%",
  },
  profile_wrapper: {
    width: "16.5%",
    aspectRatio: 1 / 1,
  },
  profile: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  active_dot: {
    width: "22.5%",
    aspectRatio: 1 / 1,
    backgroundColor: "green",
    borderRadius: 600,
    borderWidth: 1.7,
    borderColor: colors.primaryBackground,
    position: "absolute",
    bottom: 2.5,
    right: 2.5,
  },
  name: {
    fontSize: 15.5,
    fontFamily: "hn_medium",
    color: colors.textPrimary,
    fontWeight: 700,
  },
  message: {
    fontSize: 14.5,
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
  },
  notification_container: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  timestamp: {
    fontSize: 13,
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
  },
  notification: {
    fontSize: 14,
    fontFamily: "hn_medium",
    color: colors.secondaryBackground,
    backgroundColor: colors.primary,
    height: 25,
    width: 25,
    paddingTop: 1,
    textAlign: "center",
    borderRadius: 50,
    marginTop: -5,
  },
});

export default ChatPreview;
