import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";

const Preview: React.FC<{ selectedView: "likes" | "pending" }> = function ({
  selectedView,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        {selectedView === "likes"
          ? "Welcome to your Likes! 👀"
          : "(Activity) Pending... ⌛"}
      </Text>
      <Text style={styles.paragraph}>
        {selectedView === "likes"
          ? "Here, you'll find all the users who have liked you, making it easier than ever to get instant matches. Browse through your admirers and seewho catches your eye!"
          : "This is where you can keep track of everyone you've liked! You'll only see users you've shown interest in who haven’t made a decision yet - so check back to see if a match is on the way!"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "98%",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 15,
    padding: "5%",
    marginHorizontal: "1%",
    marginVertical: "5%",
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 22,
    color: colors.textPrimary,
  },
  paragraph: {
    fontFamily: "hn_regular",
    fontSize: 14.5,
    color: colors.textSecondary,
  },
});

export default Preview;
