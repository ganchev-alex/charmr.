import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { colors } from "../../../../utility/colors";
import { useCharmrSelector } from "../../../../utility/store/store";

const Heading: React.FC = function () {
  const {
    fullName,
    age,
    locationNormalized,
    knownAs,
    gender,
    about,
    sexuality,
  } = useCharmrSelector((state) => state.accountDataManager.profilePreviewData);

  return (
    <View>
      <View style={styles.row_wrapper}>
        <View>
          <Text style={styles.name}>
            {fullName.split(" ")[0]}, {age}
          </Text>
          <Text style={styles.location}>{locationNormalized}</Text>
        </View>
        <View style={styles.gender}>
          <Icon name={gender} size={40} color={colors.primary} />
        </View>
      </View>
      <Text style={styles.knownAs}>{knownAs || "About"}</Text>
      <Text style={styles.about}>
        {about || `The user haven't provided an "About" section.`}
      </Text>
      <Text style={styles.sexuality}>
        {(sexuality[0].toUpperCase() + sexuality.slice(1)).replace("_", " ")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row_wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: "hn_medium",
    fontSize: 32,
    color: colors.textPrimary,
  },
  location: {
    fontFamily: "hn_medium",
    fontSize: 18,
    color: colors.textSecondaryContrast,
    marginBottom: "8%",
  },
  knownAs: {
    fontFamily: "hn_medium",
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: "1%",
  },
  about: {
    fontFamily: "hn_regular",
    color: colors.textSecondary,
    fontSize: 16,
  },
  gender: {
    opacity: 0.85,
    marginRight: "2.5%",
    width: 60,
    height: 60,
    borderRadius: 12.5,
    borderColor: colors.primary,
    borderWidth: 1.8,
    justifyContent: "center",
    alignItems: "center",
  },
  sexuality: {
    opacity: 0.8,
    color: colors.primary,
    fontSize: 18,
    marginTop: "7%",
    paddingBottom: "3.5%",
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
  },
});

export default Heading;
