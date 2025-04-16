import { StyleSheet, Text, View } from "react-native";
import { useCharmrSelector } from "../../../../utility/store/store";

import { colors } from "../../../../utility/colors";

const ProfilePreview: React.FC = function () {
  const { credentials, details } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Preview</Text>
      <Text style={styles.known_as}>
        {details.knownAs || credentials.fullName.split(" ")[0]}
      </Text>
      <Text style={styles.about}>{details.about || "No about section."}</Text>
      <View style={styles.feature_pair}>
        <Text style={styles.feature_key}>Age:</Text>
        <Text style={styles.features_value}>{details.age}</Text>
      </View>
      <View style={styles.feature_pair}>
        <Text style={styles.feature_key}>Location:</Text>
        <Text style={styles.features_value}>{details.locationNormalized}</Text>
      </View>
      <View style={styles.feature_pair}>
        <Text style={styles.feature_key}>Gender:</Text>
        <Text style={styles.features_value}>
          {details.gender[0].toUpperCase() + details.gender.slice(1)}
        </Text>
      </View>
      <View style={styles.feature_pair}>
        <Text style={styles.feature_key}>Sexuality:</Text>
        <Text style={styles.features_value}>
          {(
            details.sexuality[0].toUpperCase() + details.sexuality.slice(1)
          ).replace("_", " ")}
        </Text>
      </View>
      <View style={styles.interests_wrapper}>
        <Text style={styles.interests_title}>Interests that define me:</Text>
        {details.interests.map((intr, i) => (
          <Text key={i} style={styles.interest}>
            {intr}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "91%",
    minHeight: 500,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 45,
    marginHorizontal: "4.5%",
    padding: "8%",
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 19,
    textAlign: "center",
  },
  known_as: {
    fontFamily: "hn_medium",
    fontSize: 16.5,
    marginTop: "7%",
    color: colors.textPrimary,
  },
  about: {
    fontFamily: "hn_regular",
    fontSize: 15.5,
    color: colors.textSecondary,
    paddingBottom: "1%",
  },
  feature_pair: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "1.75%",
  },
  feature_key: {
    fontFamily: "hn_medium",
    fontSize: 16.5,
    color: colors.textSecondaryContrast,
  },
  features_value: {
    fontFamily: "hn_regular",
    fontSize: 16.5,
    color: colors.primary,
    paddingTop: 5.5,
  },
  interests_wrapper: {
    flexDirection: "row",
    borderTopColor: colors.extraLightGrey,
    borderTopWidth: 1.5,
    marginTop: "3.5%",
    paddingTop: "4%",
    flexWrap: "wrap",
    gap: 7.5,
  },
  interests_title: {
    fontFamily: "hn_medium",
    color: colors.textPrimary,
    fontSize: 16.5,
    width: "100%",
  },
  interest: {
    fontFamily: "hn_regular",
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    backgroundColor: colors.primaryBackground,
    borderRadius: 20,
  },
});

export default ProfilePreview;
