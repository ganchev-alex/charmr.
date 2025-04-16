import { Pressable, StyleSheet, View } from "react-native";
import IconFA6 from "react-native-vector-icons/FontAwesome6";
import IconO from "react-native-vector-icons/Octicons";

import { colors } from "../../../../utility/colors";

const SwipingControls: React.FC<{
  previewMode: "pending" | "like" | "swiper" | "chat";
  modalData?: { name: string; id: string };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeTop?: () => void;
  onReturn?: () => void;
  onDislike?: React.Dispatch<
    React.SetStateAction<{
      mode: "reject" | "remove" | "match" | "likes" | "pending";
      visibility: boolean;
      name: string;
      id: string;
    }>
  >;
}> = function ({
  previewMode,
  modalData,
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
  onReturn,
  onDislike,
}) {
  return (
    <View style={styles.controls}>
      {previewMode == "swiper" && (
        <>
          <Pressable style={styles.side_button} onPress={onSwipeLeft}>
            <IconFA6 name="xmark" size={35} color={colors.rewindButton} />
          </Pressable>
          <Pressable style={styles.prime_button} onPress={onSwipeRight}>
            <IconFA6
              name="heart-circle-plus"
              size={45}
              color={colors.secondaryBackground}
            />
          </Pressable>
          <Pressable style={styles.side_button} onPress={onSwipeTop}>
            <IconO name="star-fill" size={35} color={colors.superlikeButton} />
          </Pressable>
        </>
      )}
      {previewMode == "like" && (
        <>
          <Pressable
            style={styles.side_button}
            onPress={() =>
              onDislike &&
              onDislike({
                mode: "reject",
                visibility: true,
                name: modalData?.name || "",
                id: modalData?.id || "",
              })
            }
          >
            <IconFA6 name="xmark" size={35} color={colors.rewindButton} />
          </Pressable>
          <Pressable style={styles.prime_button} onPress={onSwipeRight}>
            <IconFA6
              name="heart-circle-plus"
              size={45}
              color={colors.secondaryBackground}
            />
          </Pressable>
          <Pressable style={styles.side_button} onPress={onReturn}>
            <IconO name="arrow-left" size={35} color={colors.primary} />
          </Pressable>
        </>
      )}
      {previewMode == "pending" && (
        <>
          <Pressable
            style={styles.side_button}
            onPress={() =>
              onDislike &&
              onDislike({
                mode: "remove",
                visibility: true,
                name: modalData?.name || "",
                id: modalData?.id || "",
              })
            }
          >
            <IconFA6 name="xmark" size={35} color={colors.rewindButton} />
          </Pressable>
          <Pressable style={styles.prime_button} onPress={onReturn}>
            <IconFA6
              name="arrow-left"
              size={45}
              color={colors.secondaryBackground}
            />
          </Pressable>
        </>
      )}
      {previewMode == "chat" && (
        <>
          <Pressable style={styles.side_button} onPress={onSwipeLeft}>
            <IconFA6 name="heart-crack" size={35} color={colors.error} />
          </Pressable>
          <Pressable style={styles.prime_button} onPress={onReturn}>
            <IconFA6
              name="arrow-left"
              size={45}
              color={colors.secondaryBackground}
            />
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-12.5%",
    gap: "5%",
  },
  side_button: {
    borderRadius: 50,
    height: 70,
    width: 70,
    backgroundColor: colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  prime_button: {
    borderRadius: 50,
    backgroundColor: colors.primary,
    height: 90,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default SwipingControls;
