import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../../utility/colors";

const ProfileControls: React.FC<{ onShowControlModal: () => void }> =
  function ({ onShowControlModal }) {
    return (
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [
            styles.button_layout,
            pressed && { backgroundColor: colors.secondary },
          ]}
          onPress={() => {
            onShowControlModal();
          }}
        >
          <Text style={styles.button}>Log out</Text>
        </Pressable>
        <Pressable
          style={[styles.button_layout, { backgroundColor: "transparent" }]}
        >
          <Text style={styles.delete_button}>Delete Account</Text>
        </Pressable>
      </View>
    );
  };

const styles = StyleSheet.create({
  controls: {
    marginTop: "7.5%",
    marginBottom: 150,
    gap: "6%",
  },
  button_layout: {
    width: "91%",
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  button: {
    borderRadius: 20,
    fontSize: 19,
    textAlign: "center",
    paddingVertical: 12.5,
    color: colors.secondaryBackground,
    fontFamily: "hn_medium",
  },
  delete_button: {
    borderRadius: 20,
    fontSize: 19,
    textAlign: "center",
    paddingVertical: 12.5,
    borderColor: colors.error,
    borderWidth: 2.5,
    fontFamily: "hn_medium",
    color: colors.error,
  },
});

export default ProfileControls;
