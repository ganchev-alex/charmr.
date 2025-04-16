import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { newPhotoAppender } from "../../../../utility/store/slices/account";

import Icon from "react-native-vector-icons/Entypo";

import * as ImagePickerTools from "expo-image-picker";

import { colors } from "../../../../utility/colors";

import { API_ROOT } from "../../../../App";
import GalleryModal from "./GalleryModal";

const Gallery: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { token } = useCharmrSelector((state) => state.authentication);
  const { gallery, profilePicture } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData
  );
  const [shallowCopy, setShallowCopy] = useState<string>("");
  const [selectedId, setSelectedId] = useState("");

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const addNewImage = async function () {
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
        setShallowCopy(result.assets[0].uri);
        uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async function (
    image: ImagePickerTools.ImagePickerAsset
  ) {
    const formPayload = new FormData();

    formPayload.append("newPhoto", {
      uri: image.uri,
      name: image.fileName,
      type: image.mimeType,
    } as any);

    try {
      const response = await fetch(`${API_ROOT}/account/add-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (response.ok) {
        const responseData: { id: string; url: string } = await response.json();
        dispatch(newPhotoAppender(responseData));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShallowCopy("");
    }
  };

  return (
    <View style={styles.container}>
      {selectedId != profilePicture.id && selectedId && (
        <GalleryModal
          onCloseModal={() => setSelectedId("")}
          selectedId={selectedId}
        />
      )}
      <Text style={styles.title}>Your Gallery</Text>
      <Text style={styles.help}>
        {gallery.length === 0
          ? "Show off your personality! Create a gallery with up to 6 photos and let your true self shine."
          : "Hold on the photo that you want to act upon. You can have up to 6 photoson your profile."}
      </Text>
      {gallery.map((image) => (
        <Pressable
          style={styles.image_slot}
          key={image.id}
          onLongPress={() => setSelectedId(image.id)}
        >
          {image.id === profilePicture.id && (
            <View style={styles.pin}>
              <Icon name="pin" size={16.5} color={colors.secondaryBackground} />
            </View>
          )}
          <Image
            source={{ uri: image.url }}
            key={image.id}
            style={styles.image}
          />
        </Pressable>
      ))}
      {shallowCopy && (
        <Animated.View style={[styles.image_slot, { opacity }]}>
          <Image source={{ uri: shallowCopy }} style={styles.image} />
        </Animated.View>
      )}
      {gallery.length < 6 && (
        <Pressable style={styles.add_button_layout} onPress={addNewImage}>
          <View style={styles.add_button}>
            <Icon name="plus" size={35} color={colors.primary} />
            <Text style={styles.add_button_label}>Add a photo</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBackground,
    width: "91%",
    borderRadius: 45,
    marginHorizontal: "4.5%",
    padding: "8%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "1.25%",
    marginTop: "5%",
    overflow: "hidden",
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 19,
    textAlign: "center",
    width: "100%",
  },
  help: {
    fontFamily: "hn_regular",
    fontSize: 15.5,
    textAlign: "center",
    width: "100%",
    color: colors.textSecondary,
    marginTop: "-3%",
    marginBottom: "3%",
  },
  image_slot: {
    width: "48.5%",
    aspectRatio: "9/16",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  pin: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: colors.primary,
    padding: 4.5,
    paddingLeft: 6,
    borderRadius: 40,
    right: -2.5,
    top: -2.5,
  },
  add_button_layout: {
    width: "48.5%",
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: 30,
  },
  add_button: {
    width: "100%",
    aspectRatio: "9/16",
    justifyContent: "center",
    alignItems: "center",
  },
  add_button_label: {
    fontFamily: "hn_regular",
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default Gallery;
