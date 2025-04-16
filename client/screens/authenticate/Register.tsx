import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import AuthHeader from "./components/AuthHeader";
import CredentialInput from "./components/CredentialInput";
import Loading from "../others/Loading";

import { useCharmrDispatch } from "../../utility/store/store";
import {
  IRootNavigation,
  IRootNavProps,
} from "../../utility/interfaces/route_props";
import {
  IGeneralMessageRes,
  IRegisterAuthenticationErrors,
  ISuccessfullAuthentication,
} from "../../utility/interfaces/responses";

import { API_ROOT } from "../../App";
import { colors } from "../../utility/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchedTokenAssigner } from "../../utility/store/slices/authentication";

const Authenticate: React.FC<IRootNavProps> = function ({ navigation }) {
  const dispatch = useCharmrDispatch();

  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    terms_agreement: false,
  });
  const [validationErrorManager, setValidationErrorManager] = useState<{
    name: string[];
    password: string[];
    email: string[];
    passwordMatch: string[];
    termsAccepted: string[];
  }>({
    name: [],
    password: [],
    email: [],
    passwordMatch: [],
    termsAccepted: [],
  });
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
      name: string[];
      password: string[];
      email: string[];
      passwordMatch: string[];
      termsAccepted: string[];
    } = {
      name: [],
      password: [],
      email: [],
      passwordMatch: [],
      termsAccepted: [],
    };
    if (!userCredentials.name)
      validationContainer.name = ["Your full name is required"];
    if (!userCredentials.password)
      validationContainer.password = ["You must provide a password."];
    if (!userCredentials.email)
      validationContainer.email = ["You must provide an email."];
    if (userCredentials.password != userCredentials.confirm_password)
      validationContainer.passwordMatch = [
        "Your confirmation password does not match the original.",
      ];
    if (!userCredentials.terms_agreement)
      validationContainer.termsAccepted = [
        "You must accept the terms and condition to create an account.",
      ];

    if (
      validationContainer.name.length ||
      validationContainer.email.length ||
      validationContainer.password.length ||
      validationContainer.passwordMatch.length ||
      validationContainer.termsAccepted.length
    ) {
      setValidationErrorManager(validationContainer);
      return true;
    } else {
      return false;
    }
  };

  const onSubmitHandler = async function () {
    setValidationErrorManager({
      name: [],
      password: [],
      email: [],
      passwordMatch: [],
      termsAccepted: [],
    });

    try {
      setLoadingState(true);

      const hasValidationErrors = clientValidation();
      if (hasValidationErrors) return;

      const response = await fetch(`${API_ROOT}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: userCredentials.name,
          email: userCredentials.email,
          password: userCredentials.password,
        }),
      });

      const responseData = await response.json();
      switch (response.status) {
        case 200:
          const { token } = responseData as ISuccessfullAuthentication;
          dispatch(fetchedTokenAssigner(token));
          navigation.navigate("preferences");
          break;
        case 400:
          const { errors } = responseData as IRegisterAuthenticationErrors;
          errors.email && manageValidationErrors("email", errors.email);
          errors.password &&
            manageValidationErrors("password", errors.password);
          errors.fullName && manageValidationErrors("name", errors.fullName);
          break;
        case 409:
          manageValidationErrors("email", [
            (responseData as IGeneralMessageRes).message,
          ]);
          break;
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
      <AuthHeader authMode="login" />
      <View style={styles.form}>
        <CredentialInput
          type="name"
          label="Full Name"
          inputValue={userCredentials.name}
          inputHandler={manageCredential}
        />
        {validationErrorManager.name.length > 0 &&
          validationErrorManager.name.map((error) => (
            <Text key={error} style={styles.error}>
              {error}
            </Text>
          ))}
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
        <CredentialInput
          type="confirm_password"
          label="Confirm Password"
          inputValue={userCredentials.confirm_password}
          inputHandler={manageCredential}
        />
        {validationErrorManager.passwordMatch.length > 0 &&
          validationErrorManager.passwordMatch.map((error) => (
            <Text key={error} style={styles.error}>
              {error}
            </Text>
          ))}
        <View style={styles.container}>
          <Pressable>
            <Icon
              name={
                userCredentials.terms_agreement
                  ? "checkbox-multiple-marked"
                  : "checkbox-multiple-blank-outline"
              }
              size={26}
              onPress={() =>
                manageCredential(
                  "terms_agreement",
                  !userCredentials.terms_agreement
                )
              }
            />
          </Pressable>
          <View style={styles.message_wrapper}>
            <Text style={styles.message}>
              I agree with the
              <Pressable style={styles.pressable}>
                <Text style={styles.link}> terms and conditions </Text>
              </Pressable>
              of Charmr dating app by signing up for an account.
            </Text>
          </View>
        </View>
        {validationErrorManager.termsAccepted.length > 0 &&
          validationErrorManager.termsAccepted.map((error) => (
            <Text key={error} style={[styles.error, { marginTop: 10 }]}>
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
            <Text style={styles.button_label}>Sign In</Text>
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
    paddingTop: 37.5,
    paddingBottom: 15,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message_wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "85%",
  },
  message: {
    fontFamily: "hn_regular",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: colors.primary,
    marginBottom: -4.5,
    fontFamily: "hn_medium",
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
  },
});

export default Authenticate;
