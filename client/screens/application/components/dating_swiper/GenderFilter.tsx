import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { filterModifier } from "../../../../utility/store/slices/account";

import { colors } from "../../../../utility/colors";

const GenderFilter: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { gender } = useCharmrSelector(
    (state) => state.accountDataManager.filters
  );

  return (
    <View style={styles.filter_wrapper}>
      <Text style={styles.label}>Show me:</Text>
      <View style={styles.options_wrapper}>
        <View
          style={[
            styles.option_layout,
            { borderTopLeftRadius: 11.5, borderBottomLeftRadius: 11.5 },
            gender === "male" && styles.active_layout,
            gender === "female" && { borderRightWidth: 0 },
          ]}
        >
          <Pressable
            onPress={() =>
              dispatch(filterModifier({ key: "gender", value: "male" }))
            }
          >
            <Text
              style={[styles.option, gender === "male" && styles.active_text]}
            >
              Male
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.option_layout,
            { borderLeftWidth: 0, borderRightWidth: 0 },
            gender === "female" && styles.active_layout,
          ]}
        >
          <Pressable
            onPress={() =>
              dispatch(filterModifier({ key: "gender", value: "female" }))
            }
          >
            <Text
              style={[styles.option, gender === "female" && styles.active_text]}
            >
              Female
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.option_layout,
            { borderTopRightRadius: 11.5, borderBottomRightRadius: 11.5 },
            gender === "both" && styles.active_layout,
            gender === "female" && { borderLeftWidth: 0 },
          ]}
        >
          <Pressable
            onPress={() =>
              dispatch(filterModifier({ key: "gender", value: "both" }))
            }
          >
            <Text
              style={[styles.option, gender === "both" && styles.active_text]}
            >
              Both
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filter_wrapper: {
    width: "100%",
    marginTop: "7.5%",
    marginBottom: "5%",
  },
  options_wrapper: {
    flexDirection: "row",
    width: "98%",
    height: 45,
    marginVertical: "1%",
    borderRadius: 15,
  },
  option_layout: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: colors.secondaryBackground,
  },
  option: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "hn_medium",
    color: colors.textPrimary,
  },
  active_layout: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  active_text: {
    color: colors.primaryBackground,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondaryContrast,
    fontFamily: "hn_medium",
    marginBottom: "1.5%",
    marginLeft: "1.5%",
  },
});

export default GenderFilter;
