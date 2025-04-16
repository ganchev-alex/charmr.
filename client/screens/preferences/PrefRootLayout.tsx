import { ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { colors } from "../../utility/colors";
import { useNavigation } from "@react-navigation/native";
import { INavigationPreferenceProps } from "../../utility/interfaces/route_props";

const { width: totalScreenWidth } = Dimensions.get("screen");

const PrefRootLayout: React.FC<{
  children: ReactNode;
  nextRoute:
    | "gender"
    | "sexuality"
    | "age"
    | "location"
    | "picture"
    | "interests"
    | "verified";
  progressStep: number;
  accessibilityCondition: boolean;
  onSubmitAction?: () => Promise<void>;
}> = function ({
  children,
  nextRoute,
  progressStep,
  accessibilityCondition,
  onSubmitAction,
}) {
  const navigation = useNavigation<INavigationPreferenceProps>();

  const onProceed = function () {
    if (onSubmitAction) {
      onSubmitAction();
    } else {
      navigation.navigate(nextRoute);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.progressBarBase}>
        <View
          style={[
            styles.progressBar,
            { width: (totalScreenWidth / 6) * progressStep },
          ]}
        />
      </View>
      <Pressable
        style={[styles.back_button, { left: "5%" }]}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={require("../../assets/icons/back.png")}
          style={styles.icon}
        />
      </Pressable>
      <Text style={styles.heading}>Profile Verification</Text>
      <Text style={styles.subheading}>Help us getting to know you!</Text>
      <View>{children}</View>
      {accessibilityCondition && (
        <View style={styles.button_layout}>
          <Pressable
            style={({ pressed }) => [
              pressed ? { backgroundColor: colors.secondary } : {},
              styles.button,
            ]}
            onPress={onProceed}
          >
            <Text style={styles.button_text}>
              {nextRoute === "verified" ? "Finish" : "Continue"}
            </Text>
            <Image
              source={require("../../assets/icons/arrow.png")}
              style={styles.button_icon}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primaryBackground,
    flex: 1,
    alignItems: "center",
  },
  heading: {
    color: colors.primary,
    fontSize: 18.5,
    fontFamily: "hn_medium",
    marginTop: "5.5%",
  },
  subheading: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: "hn_medium",
    marginTop: -2.5,
    marginBottom: "12.5%",
  },
  back_button: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: "5.5%",
    zIndex: 10,
  },
  icon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  button_layout: {
    width: "85%",
    height: "7.5%",
    maxHeight: 47.5,
    borderRadius: 12.5,
    overflow: "hidden",
    backgroundColor: colors.primary,
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
  button_icon: {
    width: 17.5,
    height: 17.5,
    objectFit: "contain",
  },
  progressBarBase: {
    width: "100%",
    height: 6,
    backgroundColor: colors.extraLightGrey,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    opacity: 0.8,
  },
});

export default PrefRootLayout;
