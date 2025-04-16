import { View, Pressable, StyleSheet } from "react-native";
import IconFA6 from "react-native-vector-icons/FontAwesome6";
import IconO from "react-native-vector-icons/Octicons";
import { colors } from "../../../../utility/colors";

const SwipingButton: React.FC<{
  icon: "pass" | "back" | "superlike" | "like";
  action: () => void;
}> = function ({ icon, action }) {
  let selectedBackground;

  switch (icon) {
    case "pass":
      selectedBackground = colors.dislikeButtonBackground;
      break;
    case "back":
      selectedBackground = colors.rewindButtonBackground;
      break;
    case "superlike":
      selectedBackground = colors.superlikeButtonBackground;
      break;
    case "like":
      selectedBackground = colors.secondary;
      break;
  }

  return (
    <View
      style={[
        styles.buttonLayout,
        { height: icon === "back" ? "70%" : "100%" },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          pressed && { backgroundColor: selectedBackground },
          styles.button,
        ]}
        onPress={action}
      >
        {icon === "pass" && (
          <IconFA6 name="xmark" size={37.5} color={colors.dislikeButton} />
        )}
        {icon === "back" && (
          <IconFA6
            name="arrow-rotate-left"
            size={27.5}
            color={colors.rewindButton}
          />
        )}
        {icon === "superlike" && (
          <IconO name="star-fill" size={37.5} color={colors.superlikeButton} />
        )}
        {icon === "like" && (
          <IconFA6
            name="heart-circle-plus"
            size={37.5}
            color={colors.primary}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonLayout: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    aspectRatio: "1/1",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2.5,
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SwipingButton;
