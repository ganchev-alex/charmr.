import { StyleSheet, View, Text, Pressable, Animated } from "react-native";
import { useCharmrDispatch } from "../../../../utility/store/store";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../../utility/colors";
import { tokenCleaner } from "../../../../utility/store/slices/authentication";
import { useEffect, useRef } from "react";

const LogOutModal: React.FC<{ onCloseModal: () => void }> = function ({
  onCloseModal,
}) {
  const dispatch = useCharmrDispatch();
  const navigator = useNavigation();

  const modalAnimationRef = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(modalAnimationRef, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTogglePress = () => {
    Animated.timing(modalAnimationRef, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onCloseModal();
    });
  };

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateY: modalAnimationRef }] }]}
    >
      <Text style={styles.message}>
        Are you sure you want to log out of the application?
      </Text>
      <Pressable
        style={styles.button_layout}
        onPress={() => {
          dispatch(tokenCleaner());
          navigator
            .getParent()
            ?.getParent()
            ?.navigate("authenticate", { screen: "login" });
        }}
      >
        <Text style={[styles.button, { color: colors.primary }]}>Log Out</Text>
      </Pressable>
      <Pressable style={styles.button_layout} onPress={handleTogglePress}>
        <Text
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              color: colors.secondaryBackground,
            },
          ]}
        >
          Stay
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    width: "91.5%",
    bottom: 0,
    marginHorizontal: "4.5%",
    backgroundColor: colors.secondaryBackground,
    height: 177.5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: "8%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 18,
    fontFamily: "hn_medium",
    lineHeight: 20,
    color: colors.textPrimary,
  },
  button_layout: {
    width: "47.5%",
    marginTop: 28.5,
  },
  button: {
    textAlign: "center",
    borderWidth: 2.3,
    borderColor: colors.primary,
    borderRadius: 12.5,
    fontSize: 20,
    fontFamily: "hn_medium",
    paddingVertical: 8,
  },
});

export default LogOutModal;
