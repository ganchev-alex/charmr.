import { Alert, Pressable, StyleSheet, Text, Image } from "react-native";
import * as ImagePickerTools from "expo-image-picker";

import PrefRootLayout from "./PrefRootLayout";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";
import { verificationStateModifier } from "../../utility/store/slices/details";

import { colors } from "../../utility/colors";

const Picture: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { profilePic } = useCharmrSelector(
    (state) => state.detailsManager.verification
  );

  const uploadImage = async function () {
    try {
      const { status } = await ImagePickerTools.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permision denied", "Grant access to your photos.");
      }

      const result = await ImagePickerTools.launchImageLibraryAsync({
        mediaTypes: ImagePickerTools.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [10, 16],
        quality: 0.6,
      });

      if (!result.canceled) {
        dispatch(
          verificationStateModifier({
            key: "profilePic",
            value: result.assets[0],
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PrefRootLayout
      nextRoute="interests"
      progressStep={5}
      accessibilityCondition={profilePic.uri != ""}
    >
      <Pressable
        style={[
          styles.uploadButton,
          profilePic.uri != "" && { borderColor: colors.primary },
        ]}
        onPress={uploadImage}
      >
        {profilePic.uri === "" ? (
          <Text style={styles.label}>Click to Upload</Text>
        ) : (
          <Image source={{ uri: profilePic.uri }} style={styles.image} />
        )}
      </Pressable>
      <Text style={styles.heading}>Everything starts with a picture!</Text>
      <Text style={styles.subheading}>
        Make a good first impression. Select a profile picture that will be the
        face of your account. Later on you will be able to change it and even
        upload more photos of you.
      </Text>
    </PrefRootLayout>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    width: "55%",
    aspectRatio: "10/16",
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: "dashed",
    alignSelf: "center",
    borderColor: colors.textSecondary,
    marginBottom: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "95%",
    width: "93%",
    borderRadius: 15,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "hn_regular",
  },
  heading: {
    fontSize: 20,
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "hn_regular",
    color: colors.textSecondary,
    textAlign: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
    alignSelf: "center",
    marginBottom: "10%",
  },
});

export default Picture;
