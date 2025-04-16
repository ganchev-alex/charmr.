import { useContext, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCharmrDispatch } from "../../utility/store/store";
import { fetchedTokenAssigner } from "../../utility/store/slices/authentication";

import AuthHeader from "./components/AuthHeader";
import CredentialInput from "./components/CredentialInput";
import Loading from "../others/Loading";

import { API_ROOT } from "../../App";
import {
  IGeneralMessageRes,
  ILoginAuthenticationErrors,
  ISuccessfullAuthentication,
} from "../../utility/interfaces/responses";

import { colors } from "../../utility/colors";

const Login: React.FC = function () {
  const navigation = useNavigation();
  const dispatch = useCharmrDispatch();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [validationErrorManager, setValidationErrorManager] = useState<{
    email: string[];
    password: string[];
  }>({ email: [], password: [] });
  const [loadingState, setLoadingState] = useState(false);

  const manageCredential = function (
    credentialKey:
      | "name"
      | "email"
      | "password"
      | "confirm_password"
      | "terms_agreement",
    value: string | boolean
  ) {
    setUserCredentials((prevState) => {
      return {
        ...prevState,
        [credentialKey]: value,
      };
    });
  };

  const manageValidationErrors = function (errorKey: string, error: string[]) {
    setValidationErrorManager((prevState) => {
      return {
        ...prevState,
        [errorKey]: [...error],
      };
    });
  };

  const clientValidation = function () {
    const validationContainer: {
      email: string[];
      password: string[];
    } = { email: [], password: [] };

    if (!userCredentials.email)
      validationContainer.email = ["You must provide an email."];
    if (!userCredentials.password)
      validationContainer.password = ["You must provide a password."];

    if (
      validationContainer.email.length ||
      validationContainer.password.length
    ) {
      setValidationErrorManager(validationContainer);
      return true;
    } else {
      return false;
    }
  };

  const onSubmitHandler = async function () {
    setLoadingState(true);
    setValidationErrorManager({ email: [], password: [] });

    try {
      const hasValidationErrors = clientValidation();
      if (hasValidationErrors) return;

      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const responseData = await response.json();
      switch (response.status) {
        case 400:
          const { errors } = responseData as ILoginAuthenticationErrors;
          errors.email && manageValidationErrors("email", errors.email);
          errors.password &&
            manageValidationErrors("password", errors.password);
          break;
        case 404:
          const { message: messageNotFound } =
            responseData as IGeneralMessageRes;
          manageValidationErrors("email", [messageNotFound]);
          break;
        case 401:
          const { message } = responseData as IGeneralMessageRes;
          manageValidationErrors("password", [message]);
        case 200:
          const { token } = responseData as ISuccessfullAuthentication;
          dispatch(fetchedTokenAssigner(token));
          navigation.getParent()?.navigate("app");
      }
    } catch (error) {
      console.log("Client Error: ", error);
    } finally {
      setLoadingState(false);
    }
  };

  return loadingState ? (
    <Loading />
  ) : (
    <ScrollView style={styles.screen}>
      <AuthHeader authMode="register" />
      <View style={styles.form}>
        <Image
          source={require("../../assets/icons/main.png")}
          style={styles.icon}
        />
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subheading}>
          Log in to reconnect with your matches and continue the conversation.
        </Text>
        <CredentialInput
          type="email"
          label="E-mail"
          inputValue={userCredentials.email}
          inputHandler={manageCredential}
        />
        {validationErrorManager.email.length > 0 &&
          validationErrorManager.email.map((error) => (
            <Text key={error} style={styles.error}>
              {error}
            </Text>
          ))}
        <CredentialInput
          type="password"
          label="Password"
          inputValue={userCredentials.password}
          inputHandler={manageCredential}
        />
        {validationErrorManager.password.length > 0 &&
          validationErrorManager.password.map((error) => (
            <Text key={error} style={styles.error}>
              {error}
            </Text>
          ))}
        <View style={styles.button_layout}>
          <Pressable
            style={({ pressed }) => [
              pressed ? { backgroundColor: colors.secondary } : {},
              styles.button,
            ]}
            onPress={onSubmitHandler}
          >
            <Text style={styles.button_label}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primaryBackground,
    minHeight: "100%",
    flex: 1,
  },
  form: {
    width: "97.5%",
    minHeight: "100%",
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    margin: "auto",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: "center",
  },
  icon: {
    width: 67.5,
    height: 67.5,
  },
  heading: {
    fontSize: 26,
    color: colors.textPrimary,
    fontFamily: "hn_medium",
    marginTop: 7.5,
    marginBottom: 2.5,
  },
  subheading: {
    fontSize: 15.5,
    color: colors.textSecondary,
    fontFamily: "hn_regular",
    textAlign: "center",
    width: "90%",
    marginBottom: 25,
  },
  button_layout: {
    width: "100%",
    height: 45,
    marginTop: 35,
    borderRadius: 15,
    backgroundColor: colors.primary,
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
  error: {
    fontSize: 14,
    color: colors.error,
    fontFamily: "hn_regular",
    marginTop: -5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    textAlign: "left",
    width: "92.5%",
  },
});

export default Login;
