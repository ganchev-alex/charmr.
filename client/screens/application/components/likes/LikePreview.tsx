import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { LikeCard } from "../../../../utility/interfaces/data_types";

const LikesPreview: React.FC<{ like: LikeCard }> = function ({ like }) {
  return (
    <View style={styles.slot_container}>
      <LinearGradient
        colors={[
          like.isSuperLike ? "rgb(229,40,88)" : "#1E1E1E",
          "rgba(30,30,30,0)",
        ]}
        start={[0, 1]}
        end={[0, 0]}
        style={styles.gradient}
      />
      <Image
        source={{ uri: like.profilePicture }}
        style={styles.picture}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.name}>
          {like.name.split(" ")[0]}, {like.age}
        </Text>
        <Text style={styles.distance}>
          {like.distance == 0 ? 1 : like.distance} km.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slot_container: {
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 6.5,
  },
  picture: {
    width: "100%",
    aspectRatio: "9/11",
    borderRadius: 12.5,
  },
  gradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    left: 0,
    marginHorizontal: 5,
    marginVertical: 6.5,
    borderRadius: 12.5,
    opacity: 0.65,
  },
  details: {
    position: "absolute",
    width: "100%",
    marginHorizontal: 5,
    marginVertical: 6.5,
    bottom: "5%",
    left: "5%",
    zIndex: 2,
  },
  name: {
    fontFamily: "hn_medium",
    color: colors.secondaryBackground,
    fontSize: 18,
  },
  distance: {
    fontFamily: "hn_regular",
    color: colors.primaryBackground,
    fontSize: 16,
  },
});

export default LikesPreview;
