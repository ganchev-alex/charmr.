import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";

const Heading: React.FC<{
  selectedView: "likes" | "pending";
  onChangeDistributionToRecieved: () => void;
  onChangeDistributionToGiven: () => void;
}> = function ({
  selectedView,
  onChangeDistributionToRecieved,
  onChangeDistributionToGiven,
}) {
  return (
    <View style={styles.navigation}>
      <Pressable onPress={onChangeDistributionToRecieved}>
        <Text style={[styles.label, selectedView === "likes" && styles.active]}>
          Likes
        </Text>
      </Pressable>
      <Pressable onPress={onChangeDistributionToGiven}>
        <Text
          style={[styles.label, selectedView === "pending" && styles.active]}
        >
          (Liked) Pending
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "1.5%",
    marginBottom: "2.5%",
    gap: "15%",
  },
  label: {
    fontFamily: "hn_medium",
    fontSize: 16,
    color: colors.textSecondary,
    paddingHorizontal: "1.5%",
    paddingBottom: "0.7%",
  },
  active: {
    borderBottomWidth: 2,
    color: colors.textPrimary,
    borderColor: colors.primary,
  },
});

export default Heading;
