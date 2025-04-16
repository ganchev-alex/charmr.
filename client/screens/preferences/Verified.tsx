import { useEffect } from "react";
import { Text, View, Pressable, StyleSheet, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

import { colors } from "../../utility/colors";

const Verified: React.FC = function () {
  const navigation = useNavigation();

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
      <LottieView
        source={require("../../assets/animations/verifiedAnimation.json")}
        autoPlay
        loop={false}
        speed={0.9}
        style={styles.animation}
      />
      <Text style={styles.header}>Successful Verification!</Text>
      <Text style={styles.description}>
        Your account has been successfully verified! Your current preferences
        have been set as the default. You can update them later if needed, but
        if no changes are made, the existing preferences will remain in use.
      </Text>
      <View style={styles.button_layout}>
        <Pressable
          style={({ pressed }) => [
            pressed ? { backgroundColor: colors.secondary } : {},
            styles.button,
          ]}
          onPress={() => navigation.getParent()?.navigate("app")}
        >
          <Text style={styles.button_text}>Take me to the app</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
  },
  animation: {
    width: "50%",
    aspectRatio: "1/1",
    marginBottom: "17.5%",
  },
  header: {
    fontSize: 22.5,
    width: "80%",
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: "hn_medium",
  },
  description: {
    fontSize: 16,
    width: "80%",
    textAlign: "center",
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    marginTop: 12.5,
  },
  button_layout: {
    width: "85%",
    height: "7.5%",
    maxHeight: 47.5,
    borderRadius: 12.5,
    overflow: "hidden",
    backgroundColor: colors.primary,
    marginTop: "10%",
  },
  button: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7.5,
  },
  button_text: {
    marginTop: -3,
    fontFamily: "hn_medium",
    textAlign: "center",
    fontSize: 19,
    color: colors.secondaryBackground,
  },
});

export default Verified;
