import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useCharmrSelector } from "../../../../utility/store/store";
import { useDispatch } from "react-redux";
import {
  givenLikeRemover,
  newMatchesSetter,
  recievedLikeRemover,
} from "../../../../utility/store/slices/account";

import { LinearGradient } from "expo-linear-gradient";
import Loading from "../../../others/Loading";
import SwipingControls from "../profile_preview/SwipingControls";

import { colors } from "../../../../utility/colors";
import { API_ROOT } from "../../../../App";
import { Match } from "../../../../utility/interfaces/data_types";
import { IApplicationProps } from "../../../../utility/interfaces/route_props";

const LikesSettingsModal: React.FC<{
  name: string;
  selectedId: string;
  mode: "reject" | "remove" | "match" | "likes" | "pending" | "unmatch";
  onCloseModal: () => void;
  onResetSelectedId: () => void;
}> = function ({ name, selectedId, mode, onCloseModal, onResetSelectedId }) {
  const dispatch = useDispatch();
  const navigation = useNavigation<IApplicationProps["navigation"]>();
  const { token } = useCharmrSelector((state) => state.authentication);
  const [localLoadingState, setLocalLoadingState] = useState(false);
  const [selectedModal, setSelectedModal] =
    useState<React.JSX.Element | null>();

  //#region Animation Config
  const slideDownAnimationRef = useRef(new Animated.Value(-100)).current;
  const fadeAnimimationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideDownAnimationRef, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnimimationRef, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTogglePress = () => {
    Animated.parallel([
      Animated.timing(slideDownAnimationRef, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimimationRef, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCloseModal();
    });
  };
  //#endregion

  //#region Manage Like Modal Definition
  const rejectLike = async function () {
    try {
      setLocalLoadingState(true);
      const response = await fetch(
        `${API_ROOT}/swiping/reject-like?likerId=${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(recievedLikeRemover(selectedId));
        handleTogglePress();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoadingState(false);
    }
  };

  const intitializeMatch = async function () {
    try {
      setLocalLoadingState(true);
      const response = await fetch(
        `${API_ROOT}/swiping/init-match?likerId=${selectedId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData: Match = await response.json();
        dispatch(newMatchesSetter([responseData]));
        handleTogglePress();
        navigation.navigate("matches_preview");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoadingState(false);
    }
  };

  const manageLikeComponent = (
    <>
      <Text style={styles.modal_title}>Act on your like</Text>
      <Text style={styles.message}>
        Do you want to match with{" "}
        <Text style={{ fontFamily: "hn_medium" }}>{name.split(" ")[0]}</Text>?
        If not, pass on them and they will be notified. You can also make that
        decision later.
      </Text>
      <View style={styles.controlls}>
        <SwipingControls
          previewMode="like"
          onReturn={handleTogglePress}
          onDislike={rejectLike}
          onSwipeRight={intitializeMatch}
        />
      </View>
    </>
  );
  //#endregion

  //#region Pending Modal Definition
  const removeLike = async function () {
    try {
      setLocalLoadingState(true);
      const response = await fetch(
        `${API_ROOT}/swiping/remove-like?likedId=${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(givenLikeRemover(selectedId));
        handleTogglePress();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalLoadingState(false);
    }
  };

  const removeLikeComponent = (
    <>
      <Text style={styles.modal_title}>Remove like</Text>
      <Text style={styles.message}>
        Do you want to remove{" "}
        <Text style={{ fontFamily: "hn_medium" }}>{name.split(" ")[0]}</Text>{" "}
        from your likes? They will be able to sent you a like back later on.
      </Text>
      <View style={styles.controlls}>
        <SwipingControls
          previewMode="pending"
          onReturn={handleTogglePress}
          onDislike={removeLike}
        />
      </View>
    </>
  );

  //#endregion

  //#region Dislike Reasurance Modal Definition
  const dislikeReasuranceComponent = (
    <>
      <Text style={styles.modal_title}>Remove like</Text>
      <Text style={styles.message}>
        Are you really sure you want to remove{" "}
        <Text style={{ fontFamily: "hn_medium" }}>{name.split(" ")[0]}</Text>{" "}
        from your likes? They will be able to sent you a like back later on.
      </Text>
      <View style={[styles.controlls, { marginTop: 0 }]}>
        <Pressable style={styles.button_layout} onPress={handleTogglePress}>
          <Text style={styles.button}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.button_layout, { backgroundColor: colors.primary }]}
          onPress={() => {
            removeLike();
            onResetSelectedId();
          }}
        >
          <Text style={[styles.button, { color: colors.secondaryBackground }]}>
            Remove Like
          </Text>
        </Pressable>
      </View>
    </>
  );
  //#endregion

  //#region  Reject Like Reasurance Modal Definition
  const rejectLikeReassuranceComponent = (
    <>
      <Text style={styles.modal_title}>Pass on a like</Text>
      <Text style={styles.message}>
        Are you really sure you want to reject the like from{" "}
        <Text style={{ fontFamily: "hn_medium" }}>{name.split(" ")[0]}</Text>?
        You will be able to send a like later if they pop up in your deck, but
        you will have to wait for them to act on.
      </Text>
      <View style={[styles.controlls, { marginTop: 0 }]}>
        <Pressable style={styles.button_layout} onPress={handleTogglePress}>
          <Text style={styles.button}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.button_layout, { backgroundColor: colors.primary }]}
          onPress={() => {
            rejectLike();
            onResetSelectedId();
          }}
        >
          <Text style={[styles.button, { color: colors.secondaryBackground }]}>
            Reject Like
          </Text>
        </Pressable>
      </View>
    </>
  );
  //#endregion

  //#region Unmatch Modal Definition
  const onUnmatch = async function () {
    try {
      setLocalLoadingState(true);
      const response = await fetch(
        `${API_ROOT}/swiping/remove-match?matcherId=${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        handleTogglePress();
        navigation.navigate("app", { screen: "messages" } as any);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLocalLoadingState(false);
    }
  };

  const unmatchComponent = (
    <>
      <Text style={[styles.modal_title, { color: colors.error }]}>
        Unmatch?
      </Text>
      <Text style={styles.message}>
        Are you really sure you want to unmatch with{" "}
        <Text style={{ fontFamily: "hn_medium" }}>{name.split(" ")[0]}</Text>?
        With this you accept to delete all of your chat history together, and to
        have NO connection with each other until you meet again through out the
        swiping deck.
      </Text>
      <View style={[styles.controlls, { marginTop: 0 }]}>
        <Pressable style={styles.button_layout} onPress={handleTogglePress}>
          <Text style={styles.button}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.button_layout, { backgroundColor: colors.error }]}
          onPress={() => {
            onUnmatch();
            onResetSelectedId();
          }}
        >
          <Text style={[styles.button, { color: colors.secondaryBackground }]}>
            Unmatch
          </Text>
        </Pressable>
      </View>
    </>
  );
  //#region

  useEffect(() => {
    switch (mode) {
      case "reject":
        setSelectedModal(rejectLikeReassuranceComponent);
        break;
      case "remove":
        setSelectedModal(dislikeReasuranceComponent);
        break;
      case "match":
      case "likes":
        setSelectedModal(manageLikeComponent);
        break;
      case "pending":
        setSelectedModal(removeLikeComponent);
        break;
      case "unmatch":
        setSelectedModal(unmatchComponent);
        break;
    }
  }, [mode]);

  return (
    <View style={styles.modal}>
      <Animated.View
        style={[
          { width: "100%", height: "100%" },
          { opacity: fadeAnimimationRef },
        ]}
      >
        <LinearGradient
          colors={["rgba(30,30,30,0)", `${colors.textPrimary}`]}
          start={[0, 1]}
          end={[0, 0]}
          style={styles.backdrop}
        >
          {localLoadingState ? (
            <Loading />
          ) : (
            <Animated.View
              style={[
                styles.settings,
                { transform: [{ translateY: slideDownAnimationRef }] },
              ]}
            >
              {selectedModal}
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 300,
  },
  settings: {
    width: "85%",
    marginHorizontal: "7.5%",
    position: "absolute",
    top: "30%",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12.5,
    padding: "5%",
  },
  modal_title: {
    fontFamily: "hn_medium",
    color: colors.primary,
    textAlign: "center",
    fontSize: 16.5,
  },
  message: {
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    marginVertical: "6%",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 20,
  },
  controlls: {
    width: "100%",
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button_layout: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  button: {
    fontSize: 16.5,
    fontFamily: "hn_medium",
    color: colors.primary,
    paddingBottom: 1.5,
    textAlign: "center",
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
});

export default LikesSettingsModal;
