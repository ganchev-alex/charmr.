import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../utility/colors";
import { useCharmrSelector } from "../../../../utility/store/store";

const Gallery: React.FC = function () {
  const { gallery } = useCharmrSelector(
    (state) => state.accountDataManager.profilePreviewData
  );

  return (
    <View>
      <Text style={styles.title}>Gallery</Text>
      <View style={styles.gallery_grid}>
        {gallery.length > 0 ? (
          gallery.map((photo) => (
            <Image
              source={{ uri: photo.url }}
              key={photo.id}
              style={styles.photo}
            />
          ))
        ) : (
          <Text style={styles.message}>
            The given user haven't upload any additional photos.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "hn_medium",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  gallery_grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "2%",
  },
  photo: {
    width: "48%",
    height: 1,
    aspectRatio: 9 / 16,
    borderRadius: 25,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "hn_regular",
    color: colors.textSecondary,
    width: "100%",
    marginTop: -10,
    marginBottom: 15,
  },
});

export default Gallery;
