import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { useNavigation } from "@react-navigation/native";

const RedirectionModal: React.FC = function () {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <View style={styles.backdrop} />
      <View style={styles.modal}>
        <Text style={styles.title}>Unathenticated</Text>
        <Text style={styles.message}>
          Your authentication token has expired. Please log in again.
        </Text>
        <Pressable
          style={styles.button_layout}
          onPress={() =>
            navigation.navigate("authenticate", { screen: "login" })
          }
        >
          <Text style={styles.button_label}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },
  backdrop: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: colors.textPrimary,
    opacity: 0.8,
  },
  modal: {
    width: "80%",
    position: "absolute",
    backgroundColor: colors.secondaryBackground,
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    padding: "6%",
    borderRadius: 15,
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 19,
    textDecorationLine: "underline",
    color: colors.textPrimary,
    textAlign: "center",
  },
  message: {
    fontFamily: "hn_regular",
    fontSize: 18,
    textAlign: "center",
    marginTop: "2%",
    marginBottom: "5%",
    color: colors.textSecondary,
  },
  button_layout: {
    backgroundColor: colors.primary,
    alignSelf: "center",
    borderRadius: 17.5,
  },
  button_label: {
    textAlign: "center",
    color: colors.secondaryBackground,
    fontSize: 18,
    fontFamily: "hn_medium",
    paddingTop: "2%",
    paddingBottom: "2.5%",
    paddingHorizontal: "25%",
  },
});

export default RedirectionModal;
