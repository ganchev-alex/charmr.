import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";

import { colors } from "../../../../utility/colors";
import { API_ROOT } from "../../../../App";
import {
  pictureRemover,
  profilePictureModifier,
} from "../../../../utility/store/slices/account";
import Loading from "../../../others/Loading";

const GalleryModal: React.FC<{ onCloseModal: () => void; selectedId: string }> =
  function ({ selectedId, onCloseModal }) {
    const dispatch = useCharmrDispatch();
    const { token } = useCharmrSelector((state) => state.authentication);
    const { profilePicture } = useCharmrSelector(
      (state) => state.accountDataManager.loadedUserData
    );

    const fadeAnimimationRef = useRef(new Animated.Value(0)).current;
    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
      Animated.timing(fadeAnimimationRef, {
        toValue: 0.7,
        duration: 125,
        useNativeDriver: true,
      }).start();
    }, []);

    const handleTogglePress = () => {
      Animated.timing(fadeAnimimationRef, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }).start(() => {
        onCloseModal();
      });
    };

    const changeProfilePicture = async function () {
      try {
        setLoadingState(true);
        const response = await fetch(`${API_ROOT}/account/profile-pic`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentId: profilePicture.id,
            newId: selectedId,
          }),
        });

        if (response.ok) {
          dispatch(profilePictureModifier(selectedId));
          handleTogglePress();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    };

    const removePicture = async function () {
      try {
        setLoadingState(true);
        const response = await fetch(
          `${API_ROOT}/account/remove-pic?deleteId=${selectedId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          dispatch(pictureRemover(selectedId));
          handleTogglePress();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    };

    return (
      <>
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnimimationRef }]}
        />
        <View style={styles.modal}>
          {loadingState ? (
            <Loading />
          ) : (
            <>
              <Text style={styles.title}>Manage Gallery</Text>
              <Pressable
                style={[
                  styles.button_layout,
                  { backgroundColor: colors.primary, marginBottom: 10 },
                ]}
                onPress={changeProfilePicture}
              >
                <Text
                  style={[
                    styles.button,
                    {
                      color: colors.secondaryBackground,
                    },
                  ]}
                >
                  Set as a profile picture
                </Text>
              </Pressable>
              {
                <Pressable style={styles.button_layout} onPress={removePicture}>
                  <Text
                    style={[
                      styles.button,
                      { color: colors.error, borderColor: colors.error },
                    ]}
                  >
                    Remove from gallery
                  </Text>
                </Pressable>
              }
              <Pressable
                style={[
                  styles.button_layout,
                  { marginTop: 20, borderWidth: 0 },
                ]}
                onPress={handleTogglePress}
              >
                <Text style={styles.cancel_button}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      </>
    );
  };

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.textPrimary,
    opacity: 0.7,
    width: "125%",
    height: "125%",
    zIndex: 4,
    position: "absolute",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-35%" }, { translateY: "-25%" }],
    backgroundColor: colors.secondaryBackground,
    zIndex: 5,
    padding: "5%",
    borderRadius: 12.5,
  },
  title: {
    fontFamily: "hn_medium",
    color: colors.primary,
    textAlign: "center",
    fontSize: 16.5,
    marginBottom: 20,
  },
  button_layout: {
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: 12.5,
    borderColor: colors.primary,
  },
  button: {
    fontSize: 17,
    fontFamily: "hn_medium",
    textAlign: "center",
  },
  cancel_button: {
    textAlign: "center",
    fontSize: 15.5,
    fontFamily: "hn_medium",
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
});

export default GalleryModal;
