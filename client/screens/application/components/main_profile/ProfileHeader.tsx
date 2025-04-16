import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import IconM from "react-native-vector-icons/MaterialIcons";
import IconF from "react-native-vector-icons/Feather";

import { colors } from "../../../../utility/colors";
import { useCharmrSelector } from "../../../../utility/store/store";

const ProfileHeader: React.FC<{ onOpenEditingForm: () => void }> = function ({
  onOpenEditingForm,
}) {
  const { credentials, details, profilePicture } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.profile_pic_wrapper}>
        <Image
          source={{ uri: profilePicture.url }}
          style={styles.profile_pic}
          resizeMode="cover"
        />
      </View>
      <View style={styles.title_wrapper}>
        <Text style={styles.title}>{credentials.fullName}</Text>
        <IconM
          name="verified"
          size={20}
          color={
            credentials.verificationStatus
              ? colors.primary
              : colors.textSecondary
          }
          style={{ marginTop: 2 }}
        />
      </View>
      <Text style={styles.location}>{details.locationNormalized}</Text>
      <Pressable style={styles.button_layout} onPress={onOpenEditingForm}>
        <Text style={styles.button_label}>Edit Profile</Text>
        <IconF name="edit" size={13} color={colors.rewindButton} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: "12.5%",
    width: "100%",
    minHeight: 150,
    alignItems: "center",
  },
  profile_pic_wrapper: {
    width: "37.5%",
    aspectRatio: "1/1",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: 150,
    borderStyle: "dashed",
  },
  profile_pic: {
    width: "91.5%",
    height: "91.5%",
    borderRadius: 150,
    borderWidth: 0.5,
    borderColor: colors.textSecondary,
  },
  title_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: "1%",
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 18,
  },
  location: {
    fontFamily: "hn_regular",
    fontSize: 15,
    color: colors.textSecondary,
  },
  button_layout: {
    minWidth: "20%",
    flexDirection: "row",
    paddingTop: "6.5%",
    paddingBottom: "3.5%",
    alignItems: "center",
    gap: 2.5,
  },
  button_label: {
    color: colors.rewindButton,
    fontSize: 13.5,
    fontFamily: "hn_regular",
  },
});

export default ProfileHeader;
