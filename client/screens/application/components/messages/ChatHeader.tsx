import { StyleSheet, View, Pressable, Image, Text } from "react-native";

import IconFA6 from "react-native-vector-icons/FontAwesome6";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../../../utility/colors";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useCharmrSelector } from "../../../../utility/store/store";

const ChatHeader: React.FC<{
  onOpenProfilePreview: () => void;
  onOpenUnmatchModal: () => void;
}> = function ({ onOpenProfilePreview, onOpenUnmatchModal }) {
  const navigator = useNavigation();
  const { recipientDetails, onlineUsers } = useCharmrSelector(
    (state) => state.signalRDataManager
  );

  const [settingsVisibility, setSettingsVisibility] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.button_layout}
          onPress={() => navigator.goBack()}
        >
          <IconFA6 name="chevron-left" size={25} color={colors.primary} />
        </Pressable>
        <View style={styles.heading_profile}>
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
            source={{ uri: recipientDetails.profilePic }}
          />
          {onlineUsers.includes(recipientDetails.recipientId) && (
            <View style={styles.active_dot} />
          )}
        </View>
        <Text style={styles.name}>
          {recipientDetails.fullname}, {recipientDetails.age}
        </Text>
        <Pressable
          style={styles.button_layout}
          onPress={() => setSettingsVisibility((prevState) => !prevState)}
        >
          <IconM name="dots-vertical" size={30} color={colors.primary} />
        </Pressable>
        {settingsVisibility && (
          <View style={styles.chat_settings}>
            <Pressable
              onPress={() => {
                onOpenProfilePreview();
                setSettingsVisibility(false);
              }}
              style={{
                borderBottomColor: colors.extraLightGrey,
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <Text style={styles.setting}>View Profile 👀</Text>
            </Pressable>
            <Pressable onPress={onOpenUnmatchModal}>
              <Text style={[styles.setting, { color: colors.error }]}>
                Unmatch 💔
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      {settingsVisibility && (
        <Pressable
          style={styles.settings_backdrop}
          onPress={() => setSettingsVisibility(false)}
        >
          <View />
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    padding: "1.5%",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    zIndex: 10,
  },
  button_layout: {
    width: "10%",
    aspectRatio: "1/1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  back_button_icon: {
    height: "60%",
    aspectRatio: "1/1",
  },
  heading_profile: {
    width: "13.5%",
    aspectRatio: "1/1",
    borderRadius: 50,
    marginHorizontal: "2.5%",
    marginVertical: "1.5%",
  },
  active_dot: {
    position: "absolute",
    width: 17.5,
    height: 17.5,
    borderRadius: 100,
    borderColor: colors.secondaryBackground,
    borderWidth: 2,
    backgroundColor: "green",
    right: 0,
    bottom: 0,
  },
  name: {
    fontSize: 17,
    fontFamily: "hn_medium",
    marginLeft: "1.5%",
    color: colors.textPrimary,
    width: "57.5%",
  },
  chat_settings: {
    position: "absolute",
    backgroundColor: colors.secondaryBackground,
    padding: "5%",
    elevation: 5,
    borderRadius: 25,
    right: "5.5%",
    bottom: "-165%",
    gap: 10,
  },
  setting: {
    fontFamily: "hn_medium",
    fontSize: 18,
    textAlign: "center",
    color: colors.textPrimary,
    zIndex: 20,
  },
  settings_backdrop: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 5,
  },
});

export default ChatHeader;
