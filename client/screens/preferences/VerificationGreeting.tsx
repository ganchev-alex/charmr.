import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, BackHandler } from "react-native";
import { colors } from "../../utility/colors";
import { IPreferencesProps } from "../../utility/interfaces/route_props";

const VerificationGreeting: React.FC<IPreferencesProps> = function ({
  navigation,
}) {
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.primaryHeader}>Account Created Successfully!</Text>
      <LottieView
        source={require("../../assets/animations/verificationAnimation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.secondaryHeader}>
        Complete Verification to Get Started
      </Text>
      <Text style={styles.description}>
        To ensure a secure and personalized experience, we need to verify your
        identity. Please complete the verification process so we can get to know
        you better. Verification is required to access all features of the app.
        Get started now to unlock your account!
      </Text>
      <View style={styles.button_layout}>
        <Pressable
          style={({ pressed }) => [
            pressed ? { backgroundColor: colors.secondary } : {},
            styles.button,
          ]}
          onPress={() => {
            navigation.navigate("gender");
          }}
        >
          <Text style={styles.button_label}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerificationGreeting;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryHeader: {
    fontSize: 26,
    width: "85%",
    textAlign: "center",
    color: colors.extraWinePink,
    fontFamily: "hn_medium",
    lineHeight: 26,
  },
  secondaryHeader: {
    fontSize: 20.5,
    width: "60%",
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: "hn_medium",
    lineHeight: 23,
  },
  description: {
    fontSize: 16,
    width: "85%",
    textAlign: "center",
    fontFamily: "hn_regular",
    color: colors.textSecondary,
    marginTop: 12.5,
  },
  animation: {
    width: "60%",
    aspectRatio: "1/1",
  },
  button_layout: {
    width: "85%",
    height: 45,
    marginTop: 35,
    borderRadius: 15,
    backgroundColor: colors.extraWinePink,
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button_label: {
    fontSize: 18,
    color: colors.secondaryBackground,
    fontFamily: "hn_medium",
    marginTop: -2,
  },
});
