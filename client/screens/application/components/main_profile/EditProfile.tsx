import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { updatedDetailsPayloadReseter } from "../../../../utility/store/slices/details";
import { updateDataSuccessor } from "../../../../utility/store/slices/account";

import CredentialsEditing from "./CredentialsEditing";
import DetailsEditing from "./DetailsEditings";
import InterestsEditing from "./InterestsEditing";

import { API_ROOT } from "../../../../App";
import { colors } from "../../../../utility/colors";
import Loading from "../../../others/Loading";

const EditProfile: React.FC<{ onCloseEditor: () => void }> = function ({
  onCloseEditor,
}) {
  const dispatch = useCharmrDispatch();
  const { token } = useCharmrSelector((state) => state.authentication);
  const { updatedDetailsPayload } = useCharmrSelector(
    (state) => state.detailsManager
  );
  const [loadingState, setLoadingState] = useState(false);
  const [validationErros, setValidationErros] = useState<{
    email: string;
    interests: string;
  }>({ email: "", interests: "" });

  const onSaveChanges = async function () {
    try {
      setLoadingState(true);
      const response = await fetch(`${API_ROOT}/account/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetailsPayload),
      });

      switch (response.status) {
        case 204:
          dispatch(
            updateDataSuccessor({
              knownAs: updatedDetailsPayload.knownAs,
              about: updatedDetailsPayload.about,
              locationNormalized: updatedDetailsPayload.locationNormalized,
              interests: updatedDetailsPayload.interests,
            })
          );
          dispatch(updatedDetailsPayloadReseter());
          onCloseEditor();
          break;
        case 400:
          const responseData: {
            errors?: { Email?: string[]; Interests?: string[] };
          } = await response.json();

          setValidationErros({
            interests: responseData.errors?.Interests?.[0] ?? "",
            email: responseData.errors?.Email?.[0] ?? "",
          });
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  return loadingState ? (
    <View
      style={{
        borderRadius: 50,
        overflow: "hidden",
        minHeight: "95%",
        marginVertical: "2.5%",
        width: "91%",
        alignSelf: "center",
      }}
    >
      <Loading />
    </View>
  ) : (
    <View style={styles.form}>
      <View>
        <Text style={styles.title}>Profile Editor ✒️</Text>
        <Text style={styles.message}>
          Update your details, add a little flair, and show the real you. Just a
          heads-up - some verified info can’t be changed to keep things safe and
          authentic!
        </Text>
      </View>
      <CredentialsEditing validationError={validationErros.email} />
      <DetailsEditing />
      <InterestsEditing validationError={validationErros.interests} />
      <View style={styles.controlls}>
        <Pressable
          style={styles.button_layout}
          onPress={() => {
            dispatch(updatedDetailsPayloadReseter());
            onCloseEditor();
          }}
        >
          <Text style={styles.button}>Discard</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button_layout,
            { backgroundColor: colors.primary },
            pressed && {
              backgroundColor: colors.secondary,
            },
          ]}
          onPress={onSaveChanges}
        >
          <Text style={[styles.button, { color: colors.secondaryBackground }]}>
            Save Changes
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "91%",
    minHeight: "100%",
    marginHorizontal: "4.5%",
    paddingVertical: "5%",
    gap: 25,
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 20,
    textAlign: "center",
    color: colors.primary,
    marginBottom: "2.5%",
  },
  message: {
    fontFamily: "hn_regular",
    fontSize: 16,
    lineHeight: 17,
    textAlign: "center",
    color: colors.textSecondaryContrast,
    width: "95%",
    alignSelf: "center",
  },
  controlls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button_layout: {
    width: "46.5%",
    borderWidth: 2.3,
    borderRadius: 15,
    overflow: "hidden",
    borderColor: colors.primary,
  },
  button: {
    width: "100%",
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "hn_medium",
    color: colors.primary,
  },
});

export default EditProfile;
