import { View, Text, Pressable, StyleSheet } from "react-native";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";
import { verificationStateModifier } from "../../utility/store/slices/details";

import PrefRootLayout from "./PrefRootLayout";
import Icon from "react-native-vector-icons/Ionicons";

import { colors } from "../../utility/colors";

const Gender: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { gender } = useCharmrSelector(
    (state) => state.detailsManager.verification
  );

  return (
    <PrefRootLayout
      progressStep={1}
      nextRoute="sexuality"
      accessibilityCondition={gender != ""}
    >
      <View
        style={[
          styles.defaultIcon,
          {
            backgroundColor:
              gender === "male" ? colors.primary : colors.secondaryBackground,
          },
        ]}
      >
        <Pressable
          onPress={() =>
            dispatch(
              verificationStateModifier({ key: "gender", value: "male" })
            )
          }
          style={styles.buttonLayout}
        >
          <Icon
            name="male"
            size={75}
            color={
              gender === "male" ? colors.primaryBackground : colors.primary
            }
          />
          <Text
            style={[
              styles.label,
              gender === "male" && { color: colors.secondaryBackground },
            ]}
          >
            Male
          </Text>
        </Pressable>
      </View>
      <View
        style={[
          styles.defaultIcon,
          {
            backgroundColor:
              gender === "female" ? colors.primary : colors.secondaryBackground,
          },
        ]}
      >
        <Pressable
          onPress={() =>
            dispatch(
              verificationStateModifier({ key: "gender", value: "female" })
            )
          }
          style={styles.buttonLayout}
        >
          <Icon
            name="female"
            size={75}
            color={
              gender === "female" ? colors.primaryBackground : colors.primary
            }
          />
          <Text
            style={[
              styles.label,
              gender === "female" && { color: colors.secondaryBackground },
            ]}
          >
            Female
          </Text>
        </Pressable>
      </View>
      <Text style={styles.heading}>What is your gender?</Text>
      <Text style={styles.subheading}>
        Select the option that describes you the best.
      </Text>
    </PrefRootLayout>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    marginBottom: "8.5%",
  },
  buttonLayout: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultIcon: {
    width: "50%",
    aspectRatio: "1/1",
    backgroundColor: colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: "7.5%",
  },
  label: {
    fontFamily: "hn_medium",
    fontSize: 18,
    textAlign: "center",
    marginTop: "2.5%",
    color: colors.primary,
  },
});

export default Gender;
