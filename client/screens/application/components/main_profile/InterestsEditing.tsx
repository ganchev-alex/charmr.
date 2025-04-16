import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";

import { colors } from "../../../../utility/colors";
import {
  updatedDetailsPayloadModifier,
  updatedInterestsModifier,
} from "../../../../utility/store/slices/details";

const baseInterests = [
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

const InterestsEditing: React.FC<{ validationError: string }> = function ({
  validationError,
}) {
  const dispatch = useCharmrDispatch();
  const { interests } = useCharmrSelector(
    (state) => state.accountDataManager.loadedUserData.details
  );
  const { interests: updatedInterests } = useCharmrSelector(
    (state) => state.detailsManager.updatedDetailsPayload
  );

  useEffect(() => {
    if (updatedInterests.length == 0)
      dispatch(
        updatedDetailsPayloadModifier({ key: "interests", value: interests })
      );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change your interests</Text>
      {validationError && <Text style={styles.error}>{validationError}</Text>}
      {baseInterests.map((inter, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.interest_layout,
            pressed && { backgroundColor: colors.secondaryBackground },
            updatedInterests.includes(inter) && {
              backgroundColor: colors.primaryBackground,
              borderColor: colors.textPrimary,
            },
          ]}
          onPress={() => dispatch(updatedInterestsModifier(inter))}
        >
          <Text style={styles.interest}>{inter}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 15,
    padding: "6%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8.5,
  },
  title: {
    fontFamily: "hn_medium",
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12.5,
    width: "100%",
  },
  interest_layout: {
    borderRadius: 15,
    borderColor: colors.primaryBackground,
    borderWidth: 1,
  },
  interest: {
    fontSize: 16,
    fontFamily: "hn_regular",
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  error: {
    color: colors.error,
    marginTop: 7.5,
    fontSize: 15,
    fontFamily: "hn_regular",
    width: "95%",
    alignSelf: "center",
  },
});

export default InterestsEditing;
