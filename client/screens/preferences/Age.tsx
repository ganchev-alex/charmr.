import { FlatList, View, StyleSheet, Text } from "react-native";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";
import { verificationStateModifier } from "../../utility/store/slices/details";

import PrefRootLayout from "./PrefRootLayout";
import { colors } from "../../utility/colors";

const Age: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const { birthYear: selectedYear } = useCharmrSelector(
    (state) => state.detailsManager.verification
  );

  const yearsData = Array.from(
    { length: new Date().getFullYear() - 16 - 1948 + 1 },
    (_, i) => 1948 + i
  );

  const onViewableItemsChanged = function ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: number }>;
  }) {
    if (viewableItems.length > 0) {
      const centerItem = viewableItems[Math.floor(viewableItems.length / 2)];
      if (centerItem) {
        dispatch(
          verificationStateModifier({
            key: "birthYear",
            value: centerItem.item,
          })
        );
      }
    }
  };

  return (
    <PrefRootLayout
      nextRoute="location"
      progressStep={3}
      accessibilityCondition={Number(selectedYear) >= 18}
    >
      <View>
        <FlatList
          style={styles.selector}
          showsVerticalScrollIndicator={false}
          data={yearsData}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <Text
              style={[
                styles.option,
                selectedYear === item && { color: colors.textPrimary },
              ]}
            >
              {item}
            </Text>
          )}
          snapToInterval={75}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: 75,
            offset: 75 * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          initialScrollIndex={57}
        />
        <Text style={styles.heading}>Tell us your age</Text>
        <Text style={styles.subheading}>
          You must be over the legal age of majority for you contry.
        </Text>
      </View>
    </PrefRootLayout>
  );
};

const styles = StyleSheet.create({
  selector: {
    maxHeight: 75 * 5,
    marginBottom: "7.5%",
  },
  option: {
    fontSize: 50,
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textSecondary,
    height: 75,
  },
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
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    marginBottom: "10%",
  },
});

export default Age;
