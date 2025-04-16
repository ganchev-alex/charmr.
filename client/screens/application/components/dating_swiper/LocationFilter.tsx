import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { filterModifier } from "../../../../utility/store/slices/account";

import { colors } from "../../../../utility/colors";

const LocationFilter: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { locationRadius } = useCharmrSelector(
    (state) => state.accountDataManager.filters
  );

  return (
    <View style={styles.input_wrapper}>
      <Icon
        name="map-marker-radius"
        size={32.5}
        color={colors.textSecondaryContrast}
        style={styles.icon}
      />
      <View style={styles.control_wrapper}>
        <Text style={styles.label}>
          Location Radius:{" "}
          <Text style={styles.inner_label}>{locationRadius} km</Text>
        </Text>
        <Slider
          style={styles.swiper}
          minimumValue={20}
          maximumValue={150}
          step={2}
          value={locationRadius}
          onSlidingComplete={(newRadius) =>
            dispatch(
              filterModifier({ key: "locationRadius", value: newRadius })
            )
          }
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.textSecondaryContrast}
          thumbTintColor={colors.textPrimary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input_wrapper: {
    width: "100%",
    height: 42.5,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: "3%",
    marginRight: "3.5%",
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    padding: 4,
    borderRadius: 8.5,
  },
  control_wrapper: {
    width: "80%",
    gap: "1.5%",
    justifyContent: "space-between",
    marginLeft: "-1%",
  },
  swiper: {
    width: "100%",
    height: "50%",
    borderRadius: 50,
  },
  label: {
    fontSize: 14.5,
    marginLeft: "5.5%",
    color: colors.textSecondaryContrast,
    fontFamily: "hn_medium",
  },
  inner_label: {
    color: colors.primary,
  },
  input: {
    fontFamily: "hn_medium",
    color: colors.textPrimary,
    fontSize: 15,
    flex: 1,
  },
});

export default LocationFilter;
