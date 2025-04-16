import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import MessagesHeader from "./components/messages/MessageHeader";
import ChatPreview from "./components/messages/ChatPreview";

import { colors } from "../../utility/colors";
import { ChatDetails } from "../../utility/interfaces/data_types";
import { API_ROOT } from "../../App";
import { useCharmrSelector } from "../../utility/store/store";
import { useFocusEffect } from "@react-navigation/native";

const Messages: React.FC = function () {
  const { token } = useCharmrSelector((state) => state.authentication);
  const [chats, setChats] = useState<ChatDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadInbox = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_ROOT}/messages/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData: { chats: ChatDetails[] } = await response.json();
        setChats(responseData.chats);
      }
    } catch (error) {
      console.error("Error loading inbox:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading]);

  useFocusEffect(
    useCallback(() => {
      loadInbox();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <MessagesHeader />
      <View style={styles.main}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.interlocutorId}
          renderItem={({ item }) => <ChatPreview payload={item} />}
          onRefresh={loadInbox}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.fallback}>
              <Text style={styles.fallback_title}>🕸️ No Chats Yet</Text>
              <Text style={styles.fallback_message}>
                Your inbox is empty! 💌 Start a conversation by picking one of
                your matches and get to know them. Love could be just a message
                away! ❤️
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  main: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primaryBackground,
    marginTop: "-8%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  fallback: {
    marginTop: "12.5%",
    width: "75%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  fallback_title: {
    textAlign: "center",
    fontFamily: "hn_medium",
    fontSize: 20,
    color: colors.textPrimary,
  },
  fallback_message: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "hn_regular",
    fontSize: 15,
    lineHeight: 18,
    color: colors.textSecondaryContrast,
  },
});

export default Messages;
