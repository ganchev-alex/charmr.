import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { colors } from "../../../../utility/colors";

import { API_ROOT } from "../../../../App";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";
import { IApplicationProps } from "../../../../utility/interfaces/route_props";
import { Match } from "../../../../utility/interfaces/data_types";
import { matchesSetter } from "../../../../utility/store/slices/account";
import LottieView from "lottie-react-native";

const MessagesHeader: React.FC = function () {
  const dispatch = useCharmrDispatch();
  const navigator = useNavigation<IApplicationProps["navigation"]>();
  const { token } = useCharmrSelector((state) => state.authentication);
  const { matches } = useCharmrSelector((state) => state.accountDataManager);
  const { onlineUsers } = useCharmrSelector(
    (state) => state.signalRDataManager
  );

  const [loadingState, setLoadingState] = useState(false);
  const loadMatches = async function () {
    try {
      setLoadingState(true);
      const response = await fetch(`${API_ROOT}/retrieve/matches`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData: { matches: Match[] } = await response.json();
        dispatch(matchesSetter(responseData.matches));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [])
  );

  return loadingState ? (
    <View
      style={{ height: 150, justifyContent: "center", alignItems: "center" }}
    >
      <LottieView
        source={require("../../../../assets/animations/primeAnimationLoader.json")}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
        speed={1.25}
      />
    </View>
  ) : (
    <View style={styles.header}>
      <Text style={styles.title}>charmr. messages</Text>
      <Text style={styles.subtitle}>
        Chat with ease with all of your matches!
      </Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.matchedUserId}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              navigator.navigate("chat", { userId: item.matchedUserId })
            }
            style={[
              styles.match,
              index == 0 && { marginLeft: 12.5 },
              index == matches.length - 1 && { marginRight: 12.5 },
            ]}
          >
            <Image
              source={{ uri: item.profilePicture }}
              style={styles.match_image}
            />
            {onlineUsers.includes(item.matchedUserId) && (
              <View style={styles.active_dot} />
            )}
          </Pressable>
        )}
        horizontal={matches.length > 0}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.no_matches}>
            Looks like you don't have any matches yet! Start swiping to discover
            new connections and meet awesome people.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: "2.5%",
    paddingBottom: "12.5%",
  },
  title: {
    fontFamily: "hn_heavy",
    fontSize: 20,
    textAlign: "center",
    color: colors.secondaryBackground,
  },
  subtitle: {
    fontFamily: "hn_medium",
    fontSize: 14,
    marginBottom: "2%",
    textAlign: "center",
    color: colors.extraLightPink,
  },
  match: {
    borderWidth: 1.7,
    borderRadius: 100,
    margin: 5,
    borderStyle: "dashed",
    borderColor: colors.extraLightPink,
  },
  match_image: {
    width: 70,
    height: 70,
    borderWidth: 1.7,
    borderStyle: "dashed",
    borderColor: colors.secondaryBackground,
    borderRadius: 50,
    margin: 3,
  },
  active_dot: {
    height: "25%",
    aspectRatio: 1 / 1,
    backgroundColor: "#a6d49f",
    borderColor: colors.secondaryBackground,
    borderWidth: 1.5,
    borderRadius: 100,
    position: "absolute",
    bottom: 5,
    right: 0,
  },
  no_matches: {
    marginTop: 10,
    textAlign: "center",
    width: "85%",
    alignSelf: "center",
    color: colors.secondaryBackground,
  },
});

export default MessagesHeader;
