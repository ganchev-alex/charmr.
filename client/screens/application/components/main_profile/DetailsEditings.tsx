import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { updatedDetailsPayloadModifier } from "../../../../utility/store/slices/details";
import * as LocationTools from "expo-location";

import { colors } from "../../../../utility/colors";
import Loading from "../../../others/Loading";

const DetailsEditing: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { locationNormalized, knownAs, about } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData.details
  );
  const {
    locationNormalized: updatedLocation,
    knownAs: updatedKnownAs,
    about: updatedAbout,
  } = useCharmrSelector((state) => state.detailsManager.updatedDetailsPayload);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!updatedLocation) {
      dispatch(
        updatedDetailsPayloadModifier({
          key: "locationNormalized",
          value: locationNormalized,
        })
      );
      dispatch(
        updatedDetailsPayloadModifier({ key: "knownAs", value: knownAs })
      );
      dispatch(updatedDetailsPayloadModifier({ key: "about", value: about }));
    }
  }, []);

  const updateDefaultLocation = async function () {
    try {
      setLoadingState(true);
      const { status } =
        await LocationTools.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access in your phone settings in order to continue."
        );
        return;
      }

      const position = await LocationTools.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const address = await LocationTools.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        dispatch(
          updatedDetailsPayloadModifier({ key: "latitude", value: latitude })
        );
        dispatch(
          updatedDetailsPayloadModifier({ key: "longitude", value: longitude })
        );
        dispatch(
          updatedDetailsPayloadModifier({
            key: "locationNormalized",
            value: `${address[0].city}, ${address[0].country}`,
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  return loadingState ? (
    <View style={styles.container}>
      <Loading />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
      <View>
        <Text style={styles.label}>Default Location</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Text style={styles.display}>{updatedLocation}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.button_layout,
              pressed && { backgroundColor: colors.secondary },
            ]}
            onPress={updateDefaultLocation}
          >
            <Text style={styles.button}>Change</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>Know As</Text>
        <TextInput
          style={styles.input}
          placeholder={knownAs || "No nickname"}
          value={updatedKnownAs}
          onChangeText={(updatedText) =>
            dispatch(
              updatedDetailsPayloadModifier({
                key: "knownAs",
                value: updatedText,
              })
            )
          }
        />
      </View>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>About</Text>
        <TextInput
          style={[styles.input, { textAlignVertical: "top", minHeight: 100 }]}
          placeholder={about || "No about me section"}
          multiline={true}
          numberOfLines={5}
          value={updatedAbout}
          onChangeText={(updatedText) =>
            dispatch(
              updatedDetailsPayloadModifier({
                key: "about",
                value: updatedText,
              })
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 15,
    padding: "6%",
    overflow: "hidden",
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
  display: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.textSecondaryContrast,
    borderRadius: 9.5,
    paddingHorizontal: "5%",
    paddingVertical: "2.5%",
    fontFamily: "hn_medium",
    color: colors.textSecondaryContrast,
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
    borderRadius: 9.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: 7.5,
    paddingHorizontal: 20,
    textAlign: "center",
    fontFamily: "hn_medium",
    fontSize: 15,
    color: colors.secondaryBackground,
  },
});

export default DetailsEditing;
