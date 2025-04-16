import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { useCharmrSelector } from "../../../../utility/store/store";

const Interests: React.FC = function () {
  const { interests } = useCharmrSelector(
    (state) => state.accountDataManager.profilePreviewData
  );

  return (
    <View style={styles.wrapper}>
      {interests.map((inter, index) => (
        <View key={index} style={styles.intrest_layout}>
          <Text style={styles.interest}>{inter}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: "8%",
    marginBottom: "10%",
  },
  intrest_layout: {
    backgroundColor: colors.primaryBackground,
    borderRadius: 50,
    padding: 8,
  },
  interest: {
    fontSize: 15,
  },
});

export default Interests;
