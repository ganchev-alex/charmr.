import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../../utility/colors";
import { useCharmrSelector } from "../../../../utility/store/store";

const DeckCheckPoint: React.FC<{
  onSaveSwipingActions: () => void;
  onPrepareNewDeck: () => Promise<void>;
}> = function ({
  onSaveSwipingActions: onSaveSwipingHistory,
  onPrepareNewDeck,
}) {
  const { swipingHistory } = useCharmrSelector(
    (state) => state.accountDataManager
  );

  useEffect(() => {
    if (swipingHistory.length != 0) onSaveSwipingHistory();
  }, [swipingHistory]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🪄 Keep Swiping?</Text>
      <Text style={styles.details}>
        You have reached the bottom of the deck. Do you want to get a new one
        with other profiles?
      </Text>
      <Pressable style={styles.button_layout} onPress={onPrepareNewDeck}>
        <Text style={styles.label}>Load a New Deck</Text>
      </Pressable>
    </View>
  );
};

export default DeckCheckPoint;

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
  button_layout: {
    backgroundColor: colors.primary,
    paddingVertical: "3%",
    paddingHorizontal: "14.5%",
    borderRadius: 15,
    marginTop: "7.5%",
  },
  label: {
    fontFamily: "hn_medium",
    color: colors.secondaryBackground,
    fontSize: 18,
  },
});
