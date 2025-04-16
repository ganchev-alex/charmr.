import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCharmrSelector } from "../../utility/store/store";

import PrefRootLayout from "./PrefRootLayout";
import Loading from "../others/Loading";

import { API_ROOT } from "../../App";
import { INavigationPreferenceProps } from "../../utility/interfaces/route_props";

import { colors } from "../../utility/colors";

const interests = [
  "📸 Photography",
  "🎨 Art & Drawing",
  "✍️ Writing & Blogging",
  "🎵 Music",
  "🎻 Playing Instruments",
  "👗 Fashion & Styling",
  "🛠️ DIY & Crafting",
  "🎬 Movies & TV Shows",
  "🎮 Gaming",
  "💃 Dancing",
  "🍣 Culinary Experiences",
  "🏕️ Hiking & Outdoors",
  "💪 Fitness & Gym",
  "🧘 Meditation & Mindfulness",
  "⚾ Sports",
  "📖 Reading & Books",
  "🌍 Language Learning",
  "🧠 Learning",
  "🔬 Science & Innovation",
  "💰 Investing",
  "🚀 Entrepreneurship",
  "✈️ Traveling",
  "🍳 Cooking & Baking",
  "🐶 Pets & Animal Care",
  "🖥️ Technology & Gadgets",
  "❤️ Volunteering & Charity Work",
  "🌌 Astronomy & Space",
  "✨ Astrology",
];

const Interests: React.FC = function () {
  const navigation = useNavigation<INavigationPreferenceProps>();

  const {
    birthYear,
    gender,
    sexuality,
    latitude,
    longitude,
    locationNormalized,
    profilePic,
  } = useCharmrSelector((state) => state.detailsManager.verification);
  const { token } = useCharmrSelector((state) => state.authentication);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState(false);

  const onSelectHandler = function (interest: string) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prevState) =>
        prevState.filter((intr) => intr !== interest)
      );
    } else {
      setSelectedInterests((prevState) => [...prevState, interest]);
    }
  };

  const submitVerificationPayload = async function () {
    try {
      setLoadingState(true);
      const formPayload = new FormData();

      formPayload.append("birthYear", birthYear.toString());
      formPayload.append("gender", gender);
      formPayload.append("sexuality", sexuality);
      formPayload.append("latitude", latitude.toString());
      formPayload.append("longitude", longitude.toString());
      formPayload.append("locationNormalized", locationNormalized);
      selectedInterests.forEach((interest) => {
        formPayload.append("interests", interest);
      });
      if (profilePic.uri) {
        formPayload.append("profilePic", {
          uri: profilePic.uri,
          name: profilePic.fileName,
          type: profilePic.mimeType,
        } as any);
      }

      const response = await fetch(`${API_ROOT}/auth/register-details`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formPayload,
      });

      if (response.ok) {
        navigation.navigate("verified");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  return loadingState ? (
    <Loading />
  ) : (
    <PrefRootLayout
      nextRoute="verified"
      progressStep={6}
      accessibilityCondition={selectedInterests.length >= 5}
      onSubmitAction={submitVerificationPayload}
    >
      <View style={styles.interests}>
        <ScrollView
          contentContainerStyle={styles.interestsContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {interests.map((intrest, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                selectedInterests.includes(intrest) && {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.secondaryBackground,
                },
              ]}
              onPress={() => onSelectHandler(intrest)}
            >
              <Text style={styles.interest}>{intrest}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.heading}>Interests and Hobbies</Text>
      <Text style={styles.subheading}>
        In order to expose you to more profiles that match your vibes select at
        least 5 of your interests that describe you the best.
      </Text>
    </PrefRootLayout>
  );
};

const styles = StyleSheet.create({
  interests: { width: "90%", alignSelf: "center", height: "60%" },
  interestsContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.5%",
    paddingTop: "2.5%",
    paddingBottom: "49%",
  },
  heading: {
    fontSize: 20,
    fontFamily: "hn_medium",
    textAlign: "center",
    color: colors.textPrimary,
    marginTop: "10%",
  },
  subheading: {
    fontSize: 14,
    fontFamily: "hn_regular",
    color: colors.textSecondaryContrast,
    textAlign: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "-12%",
  },
  option: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: colors.extraLightGrey,
    borderWidth: 2,
    borderRadius: 18,
  },
  interest: {
    fontSize: 15,
    fontFamily: "hn_regular",
  },
});

export default Interests;
