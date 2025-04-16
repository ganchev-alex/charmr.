import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { useEffect } from "react";
import { useCharmrSelector } from "../../../../utility/store/store";

const DeckBottom: React.FC<{ onSaveSwipingActions: () => void }> = function ({
  onSaveSwipingActions: onSaveSwipingHistory,
}) {
  const { swipingHistory } = useCharmrSelector(
    (state) => state.accountDataManager
  );

  useEffect(() => {
    if (swipingHistory.length != 0) onSaveSwipingHistory();
  }, [swipingHistory]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🤷‍♂️ Out of Profiles</Text>
      <Text style={styles.details}>
        There are no more profiles in you area that match your selected
        preferences. Try tweaking the values of the filter or come back again
        later.
      </Text>
    </View>
  );
};

export default DeckBottom;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "9.5%",
  },
  title: {
    fontFamily: "hn_heavy",
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: "center",
  },
  details: {
    fontFamily: "hn_regular",
    fontSize: 18,
    textAlign: "center",
    color: colors.textSecondary,
  },
});
