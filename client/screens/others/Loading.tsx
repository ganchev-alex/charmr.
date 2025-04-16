import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { colors } from "../../utility/colors";

const Loading: React.FC = function () {
  return (
    <View style={styles.screen}>
      <LottieView
        source={require("../../assets/animations/primeAnimationLoader.json")}
        autoPlay
        loop
        speed={1.5}
        style={styles.loader}
      />
      <Text style={styles.label}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
  },
  loader: {
    width: 200,
    height: 200,
  },
  label: {
    fontSize: 20,
    color: colors.textSecondaryContrast,
    fontFamily: "hn_regular",
    marginTop: 5,
    opacity: 0.4,
  },
});

export default Loading;
