import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { colors } from "../../utility/colors";
import {
  IWelcomeProps,
  WelcomeStackParamList,
} from "../../utility/interfaces/route_props";

const WelcomePage: React.FC<IWelcomeProps> = function ({ route, navigation }) {
  const { asset, titleIcon, title, message, buttonLabel, nextRoute } = (
    route as any
  ).params;

  return (
    <View style={styles.root}>
      <Pressable style={styles.privacy_button}>
        <Image
          source={require("../../assets/icons/policy.png")}
          style={styles.icon}
        />
      </Pressable>
      {navigation.canGoBack() && (
        <Pressable
          style={[styles.privacy_button, { left: 25 }]}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/icons/back.png")}
            style={styles.icon}
          />
        </Pressable>
      )}
      <Image source={asset} style={styles.preview} />
      <View style={styles.main}>
        <Image source={titleIcon} style={styles.titleIcon} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.button_layout}>
          <Pressable
            style={({ pressed }) => [
              pressed ? { backgroundColor: colors.secondary } : {},
              styles.button,
            ]}
            onPress={() =>
              nextRoute === "parent"
                ? navigation.getParent()?.navigate("authenticate")
                : navigation.navigate(nextRoute)
            }
          >
            <Text style={styles.button_text}>{buttonLabel}</Text>
            <Image
              source={require("../../assets/icons/arrow.png")}
              style={styles.button_icon}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const WelcomeStack = createStackNavigator<WelcomeStackParamList>();

const Welcome: React.FC = function () {
  return (
    <WelcomeStack.Navigator
      initialRouteName="greetings"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <WelcomeStack.Screen
        name="greetings"
        component={WelcomePage}
        initialParams={{
          asset: require("../../assets/images/greetings_asset.png"),
          titleIcon: require("../../assets/icons/main.png"),
          title: "Welcome to Charmr Mobile App",
          message:
            "Let us help you find your perfect match! Whether you are looking for love, friendship, or just a great conversation, we connect you with people who truly match your vibe.",
          buttonLabel: "Next",
          nextRoute: "profiles",
        }}
      />
      <WelcomeStack.Screen
        name="profiles"
        component={WelcomePage}
        initialParams={{
          asset: require("../../assets/images/profiles_asset.png"),
          titleIcon: require("../../assets/icons/profiles.png"),
          title: "You are the center! More profiles & more dates!",
          message:
            "The more, the merrier! Get Exposed to a wide range of profiles tailored by your personality and preferences. More connections, more chances at love!",
          buttonLabel: "Next",
          nextRoute: "chat",
        }}
      />
      <WelcomeStack.Screen
        name="chat"
        component={WelcomePage}
        initialParams={{
          asset: require("../../assets/images/chat_asset.png"),
          titleIcon: require("../../assets/icons/chat.png"),
          title: "Interact With The World!",
          message:
            "Chat seamlessly and securely! Break the ice, spark conversations, and build meaningful connections - all in a safe and easy-to-use space",
          buttonLabel: "Create Your Account",
          nextRoute: "parent",
        }}
      />
    </WelcomeStack.Navigator>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primaryBackground,
  },
  privacy_button: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 25,
    top: "2.5%",
    zIndex: 10,
  },
  icon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  preview: {
    width: "92.5%",
    maxHeight: "45%",
    resizeMode: "contain",
    margin: "auto",
    marginTop: "10%",
    marginBottom: "5%",
  },
  main: {
    width: "97.5%",
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    alignSelf: "center",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: "15%",
    borderTopRightRadius: "15%",
  },
  titleIcon: {
    width: 52.5,
    height: 52.5,
  },
  title: {
    fontFamily: "hn_heavy",
    textAlign: "center",
    fontSize: 24,
    color: colors.textPrimary,
  },
  message: {
    width: "97.5%",
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15.5,
    lineHeight: 20,
    marginBottom: 7.5,
  },
  button_layout: {
    width: "97.5%",
    height: "14.5%",
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
});

export default Welcome;
