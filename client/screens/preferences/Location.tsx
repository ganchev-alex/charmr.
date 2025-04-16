import { useState } from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import * as LocationTools from "expo-location";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";
import { verificationStateModifier } from "../../utility/store/slices/details";

import LottieView from "lottie-react-native";
import PrefRootLayout from "./PrefRootLayout";
import Loading from "../others/Loading";

import { colors } from "../../utility/colors";

const Location: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { locationNormalized } = useCharmrSelector(
    (state) => state.detailsManager.verification
  );

  const [loadingState, setLoadingState] = useState(false);

  const getLocation = async function () {
    setLoadingState(true);
    try {
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
          verificationStateModifier({ key: "latitude", value: latitude })
        );
        dispatch(
          verificationStateModifier({ key: "longitude", value: longitude })
        );
        dispatch(
          verificationStateModifier({
            key: "locationNormalized",
            value: `${address[0].city}, ${address[0].country}`,
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  return loadingState ? (
    <Loading />
  ) : (
    <PrefRootLayout
      nextRoute="picture"
      progressStep={4}
      accessibilityCondition={locationNormalized !== ""}
    >
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/animations/locationPermisionAnimation.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.heading}>Enter Your Location</Text>
        <Text style={styles.subheading}>
          Your location is required to help personalize the profiles you see.
          The closer you are to someone, the better the chances of meeting and
          connecting. Don't worry - you can always change your location later to
          suit your preferences.
        </Text>
      </View>
      {locationNormalized ? (
        <Text style={styles.location}>{locationNormalized}</Text>
      ) : (
        <View style={styles.button_layout}>
          <Pressable
            style={({ pressed }) => [
              pressed ? { backgroundColor: colors.textSecondary } : {},
              styles.button,
            ]}
          >
            <Text style={styles.button_text} onPress={getLocation}>
              Access Location
            </Text>
          </Pressable>
        </View>
      )}
    </PrefRootLayout>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    alignItems: "center",
  },
  animation: {
    width: "90%",
    aspectRatio: "1/1",
    marginTop: "7.5%",
  },
  heading: {
    fontSize: 20,
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textPrimary,
    marginTop: "-15%",
  },
  subheading: {
    fontSize: 14,
    fontFamily: "hn_regular",
    color: colors.textSecondary,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: "10%",
  },
  button_layout: {
    maxHeight: 47.5,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: colors.textPrimary,
    marginBottom: "10%",
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 7.5,
    borderRadius: 50,
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
  location: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "hn_medium",
    color: colors.textPrimary,
    marginTop: "2.5%",
    marginBottom: "7.5%",
  },
});
