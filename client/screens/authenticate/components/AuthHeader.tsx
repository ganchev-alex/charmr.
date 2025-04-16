import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { INavigationAuthenticationProps } from "../../../utility/interfaces/route_props";
import { colors } from "../../../utility/colors";

const AuthHeader: React.FC<{ authMode: "register" | "login" }> = function ({
  authMode,
}) {
  const navigation = useNavigation<INavigationAuthenticationProps>();

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        {authMode === "register" ? (
          <>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.paragraph}>
              Your likes and matches can't wait for you to get back!
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.paragraph}>
              We can't wait to have you on board! Handsome guys and georguos
              ladies are already on the app.
            </Text>
          </>
        )}
      </View>
      <View style={styles.profiles_grid}>
        <Image
          source={require("../../../assets/profiles/profile_1.jpg")}
          style={styles.profile}
        />
        <Image
          source={require("../../../assets/profiles/profile_2.jpg")}
          style={styles.profile}
        />
        <Image
          source={require("../../../assets/profiles/profile_3.jpg")}
          style={styles.profile}
        />
      </View>
      <View style={styles.link}>
        <Text style={{ color: colors.textPrimary, fontFamily: "hn_regular" }}>
          If you are already a user,{" "}
        </Text>
        <Pressable onPress={() => navigation.navigate(authMode)}>
          <Text style={styles.pressable}>{authMode} here.</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  titleContainer: {
    width: "47.5%",
  },
  title: {
    color: colors.textPrimary,
    fontFamily: "hn_heavy",
    fontSize: 24,
  },
  paragraph: {
    color: colors.textSecondary,
    fontFamily: "hn_regular",
    fontSize: 13.5,
    lineHeight: 16,
  },
  profiles_grid: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
  },
  profile: {
    width: "30%",
    aspectRatio: "1/1",
    resizeMode: "cover",
    borderRadius: 100,
    marginTop: 25,
  },
  link: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
  },
  pressable: {
    color: colors.primary,
    fontFamily: "hn_medium",
    marginTop: -1.5,
  },
});
