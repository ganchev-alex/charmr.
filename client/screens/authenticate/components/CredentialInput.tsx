import { useEffect, useState } from "react";
import {
  View,
  Image,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "../../../utility/colors";

let iconSrc: any;

const CredentialInput: React.FC<{
  type: "name" | "email" | "password" | "confirm_password";
  label: string;
  inputValue: string;
  inputHandler: (
    credentialKey:
      | "name"
      | "email"
      | "password"
      | "confirm_password"
      | "terms_agreement",
    value: string
  ) => void;
}> = function ({ type, label, inputValue, inputHandler }) {
  const [isTextHidden, setIsTextHidden] = useState(false);

  useEffect(() => {
    type.includes("password") && setIsTextHidden(true);
  }, []);

  switch (type) {
    case "name":
      iconSrc = require("../../../assets/icons/profile.png");
      break;
    case "email":
      iconSrc = require("../../../assets/icons/email.png");
      break;
    case "password":
      iconSrc = require("../../../assets/icons/password.png");
      break;
    case "confirm_password":
      iconSrc = require("../../../assets/icons/password_check.png");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Image source={iconSrc} style={styles.icon} />
      <TextInput
        style={styles.input}
        autoComplete="off"
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={isTextHidden}
        value={inputValue}
        onChangeText={(text) => inputHandler(type, text)}
        autoCapitalize="none"
      />
      {type.includes("password") && (
        <Pressable
          onPress={() => setIsTextHidden((prevState) => !prevState)}
          style={[
            styles.icon,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Image
            style={{ width: "65%", height: "65%" }}
            source={
              isTextHidden
                ? require("../../../assets/icons/hidden.png")
                : require("../../../assets/icons/visible.png")
            }
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 47.5,
    margin: "auto",
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    borderRadius: 12.5,
    position: "relative",
    overflow: "visible",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10.5,
    paddingRight: 9.5,
  },
  label: {
    position: "absolute",
    backgroundColor: colors.secondaryBackground,
    top: -12.5,
    left: 15,
    paddingLeft: 7.5,
    paddingRight: 7.5,
    color: colors.textSecondaryContrast,
    fontFamily: "hn_regular",
  },
  icon: {
    width: "10%",
    height: "42.5%",
    resizeMode: "contain",
  },
  input: {
    height: "100%",
    flex: 1,
    paddingLeft: 15,
    fontFamily: "hn_medium",
  },
});

export default CredentialInput;
