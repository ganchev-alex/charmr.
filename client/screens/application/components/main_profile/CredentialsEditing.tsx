import { useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { updatedDetailsPayloadModifier } from "../../../../utility/store/slices/details";

import { colors } from "../../../../utility/colors";

const CredentialsEditing: React.FC<{ validationError: string }> = function ({
  validationError,
}) {
  const dispatch = useCharmrDispatch();
  const { email: newEmail } = useCharmrSelector(
    (state) => state.detailsManager.updatedDetailsPayload
  );
  const { email } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData.credentials
  );

  useEffect(() => {
    if (!newEmail)
      dispatch(updatedDetailsPayloadModifier({ key: "email", value: email }));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Credentials</Text>
      <View>
        <Text style={styles.label}>Change Your Email</Text>
        <TextInput
          style={styles.input}
          placeholder={email}
          value={newEmail}
          onChangeText={(updatedText) =>
            dispatch(
              updatedDetailsPayloadModifier({
                key: "email",
                value: updatedText,
              })
            )
          }
        />
        {validationError && <Text style={styles.error}>{validationError}</Text>}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button_layout,
          pressed && { backgroundColor: colors.secondary },
        ]}
      >
        <Text style={styles.button}>Change Password</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 15,
    padding: "6%",
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: "7.5%",
  },
  label: {
    fontSize: 14,
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    backgroundColor: colors.secondaryBackground,
    position: "absolute",
    top: -12.5,
    left: 15,
    zIndex: 1,
    paddingHorizontal: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.textSecondaryContrast,
    borderRadius: 9.5,
    paddingHorizontal: "5%",
    fontFamily: "hn_medium",
    color: colors.textPrimary,
  },
  button_layout: {
    backgroundColor: colors.primary,
    marginTop: 25,
    borderRadius: 9.5,
  },
  button: {
    paddingVertical: 7.5,
    textAlign: "center",
    fontFamily: "hn_medium",
    fontSize: 15,
    color: colors.secondaryBackground,
  },
  error: {
    color: colors.error,
    marginTop: 7.5,
    fontSize: 15,
    fontFamily: "hn_regular",
    width: "95%",
    alignSelf: "center",
  },
});

export default CredentialsEditing;
