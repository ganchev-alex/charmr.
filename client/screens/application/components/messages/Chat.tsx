import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import IconF from "react-native-vector-icons/FontAwesome";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../../../utility/store/store";

import ChatThread from "./ChatThread";
import ChatHeader from "./ChatHeader";

import { colors } from "../../../../utility/colors";
import { API_ROOT } from "../../../../App";
import { IApplicationProps } from "../../../../utility/interfaces/route_props";
import { RecipientDetails } from "../../../../utility/interfaces/responses";
import {
  chatStateCleaner,
  recipientDetailsInitializer,
} from "../../../../utility/store/slices/signalR";
import SignalRService from "../../../../utility/signalR_service/signalRService";
import Loading from "../../../others/Loading";
import ProfilePreview from "../../ProfilePreview";
import LikesSettingsModal from "../likes/LikesSettingModal";

const Chat: React.FC<IApplicationProps> = function ({ route, navigation }) {
  const dispatch = useCharmrDispatch();
  const signalRServiceRef = useRef<SignalRService | null>(null);

  const { token } = useCharmrSelector((state) => state.authentication);
  const { recipientId, fullname } = useCharmrSelector(
    (state) => state.signalRDataManager.recipientDetails
  );

  const [newMessage, setNewMessage] = useState("");
  const threadRef = useRef<FlatList>(null);

  const [localLoadingState, setLocalLoadingState] = useState(false);
  const [isPreviewOpened, setIsPreviewOpened] = useState(false);
  const [unmatchModalVisibility, setUnmatchModalVisibility] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    visibility: false,
    messageId: "",
    recipientId: "",
  });

  const loadRecipientDetails = async function () {
    try {
      const response = await fetch(
        `${API_ROOT}/messages/recipient-details?recipientId=${
          (route.params as any).userId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData: RecipientDetails = await response.json();
        dispatch(recipientDetailsInitializer(responseData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRecipientDetails();

    signalRServiceRef.current = new SignalRService(dispatch);

    signalRServiceRef.current.initMessageHub(
      (route.params as any).userId,
      token as string,
      setLocalLoadingState
    );

    return () => {
      dispatch(chatStateCleaner());
      signalRServiceRef.current?.terminateMessageHub();
    };
  }, []);

  const onSendMessage = function () {
    if (!signalRServiceRef.current) return;

    signalRServiceRef.current.sendMessage(recipientId, newMessage);
    setNewMessage("");

    threadRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onDeleteMessage = function () {
    if (!signalRServiceRef.current) return;

    signalRServiceRef.current.deleteMessage(
      deleteModalState.messageId,
      deleteModalState.recipientId
    );

    setDeleteModalState({
      visibility: false,
      messageId: "",
      recipientId: "",
    });
  };

  return (
    <>
      {deleteModalState.visibility && (
        <>
          <Pressable
            style={styles.backdrop}
            onPress={() =>
              setDeleteModalState((prevState) => {
                return { ...prevState, visibility: false };
              })
            }
          />
          <View style={styles.delete_modal}>
            <Text style={styles.delete_title}>
              Do you want to delete this message?
            </Text>
            <Pressable
              style={styles.delete_button_layout}
              onPress={() =>
                setDeleteModalState((prevState) => {
                  return { ...prevState, visibility: false };
                })
              }
            >
              <Text style={[styles.delete_button, { color: colors.primary }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={styles.delete_button_layout}
              onPress={onDeleteMessage}
            >
              <Text
                style={[
                  styles.delete_button,
                  {
                    color: colors.secondaryBackground,
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </>
      )}
      {unmatchModalVisibility && (
        <LikesSettingsModal
          name={fullname}
          selectedId={recipientId}
          mode="unmatch"
          onCloseModal={() => {
            setUnmatchModalVisibility(false);
          }}
          onResetSelectedId={() => {}}
        />
      )}
      <View style={{ flex: 1 }}>
        {localLoadingState ? (
          <Loading />
        ) : !isPreviewOpened ? (
          <>
            <ChatHeader
              onOpenProfilePreview={() => setIsPreviewOpened(true)}
              onOpenUnmatchModal={() => setUnmatchModalVisibility(true)}
            />
            <View style={styles.message_thread}>
              <ChatThread
                threadRef={threadRef}
                onOpenDeleteModal={setDeleteModalState}
              />
            </View>
            <View style={styles.message_controller}>
              <TextInput
                placeholder="Type your message..."
                multiline={true}
                style={styles.message_input}
                value={newMessage}
                onChangeText={(message) => setNewMessage(message)}
              />
              <Pressable
                style={[
                  styles.button_layout,
                  { width: "14.5%" },
                  newMessage.length > 0 && { backgroundColor: colors.primary },
                ]}
                onPress={onSendMessage}
                disabled={newMessage.length == 0}
              >
                <IconF
                  name="send-o"
                  size={30}
                  color={
                    newMessage.length
                      ? colors.secondaryBackground
                      : colors.textSecondary
                  }
                  style={{ marginLeft: -3.5 }}
                />
              </Pressable>
            </View>
          </>
        ) : (
          <ProfilePreview
            userId={recipientId}
            previewMode="chat"
            onSwipeLeft={() => setUnmatchModalVisibility(true)}
            onReturn={() => {
              setIsPreviewOpened(false);
              navigation.navigate("app" as any);
            }}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button_layout: {
    width: "10%",
    aspectRatio: "1/1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  message_thread: {
    flex: 1,
  },
  message_controller: {
    width: "100%",
    paddingTop: "2.5%",
    paddingBottom: "3%",
    paddingHorizontal: "4.5%",
    backgroundColor: colors.secondaryBackground,
    flexDirection: "row",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 4,
    alignItems: "center",
  },
  message_input: {
    width: "85%",
    fontFamily: "hn_regular",
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  delete_modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "70%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 100,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  delete_title: {
    fontFamily: "hn_medium",
    fontSize: 18,
    width: "100%",
    lineHeight: 25,
  },
  delete_button_layout: {
    width: "45%",
    marginTop: 60,
  },
  delete_button: {
    textAlign: "center",
    fontFamily: "hn_medium",
    fontSize: 18,
    borderRadius: 9.5,
    padding: 5,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 15,
    backgroundColor: colors.textPrimary,
    opacity: 0.5,
  },
});

export default Chat;
