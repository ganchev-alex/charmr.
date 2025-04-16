import { StyleSheet, View } from "react-native";
import SwipingButton from "./SwipingButton";

const SwipingControl: React.FC<{
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeTop: () => void;
  onSwipeBack: () => void;
}> = function ({ onSwipeLeft, onSwipeRight, onSwipeTop, onSwipeBack }) {
  return (
    <View style={style.controller}>
      <SwipingButton icon="pass" action={onSwipeLeft} />
      <SwipingButton icon="back" action={onSwipeBack} />
      <SwipingButton icon="superlike" action={onSwipeTop} />
      <SwipingButton icon="like" action={onSwipeRight} />
    </View>
  );
};

const style = StyleSheet.create({
  controller: {
    width: "98%",
    height: "10%",
    marginBottom: "5.5%",
    marginTop: "-3%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default SwipingControl;
