import { useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";

import { IPreviewProfileData } from "../../utility/interfaces/responses";

import SwipingControls from "./components/profile_preview/SwipingControls";
import Heading from "./components/profile_preview/Heading";
import Interests from "./components/profile_preview/Interests";
import Gallery from "./components/profile_preview/Gallery";

import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";
import { API_ROOT } from "../../App";

import { colors } from "../../utility/colors";
import { profilePreviewLoader } from "../../utility/store/slices/account";
import Loading from "../others/Loading";

const { height } = Dimensions.get("window");

const ProfilePreview: React.FC<{
  userId: string;
  previewMode: "pending" | "like" | "swiper" | "chat";
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeTop?: () => void;
  onReturn?: () => void;
  onDislike?: React.Dispatch<
    React.SetStateAction<{
      mode: "reject" | "remove" | "match" | "likes" | "pending";
      visibility: boolean;
      name: string;
      id: string;
    }>
  >;
}> = function ({
  userId,
  previewMode,
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
  onDislike,
  onReturn,
}) {
  const dispatch = useCharmrDispatch();
  const { token } = useCharmrSelector((state) => state.authentication);
  const { profilePreviewData } = useCharmrSelector(
    (state) => state.accountDataManager
  );
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const loadPreviewUserData = async function () {
      try {
        setLoadingState(true);
        const response = await fetch(
          `${API_ROOT}/retrieve/profile?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const responseData: IPreviewProfileData = await response.json();
          dispatch(profilePreviewLoader(responseData));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    };

    loadPreviewUserData();
  }, []);

  return loadingState ? (
    <View style={style.screen}>
      <Loading />
    </View>
  ) : (
    <ScrollView style={style.screen}>
      <Image
        source={{ uri: profilePreviewData.profilePicture.url }}
        style={style.profile_pic}
        resizeMode="cover"
      />
      <SwipingControls
        previewMode={previewMode}
        modalData={{ name: profilePreviewData.fullName, id: userId }}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        onSwipeTop={onSwipeTop}
        onDislike={onDislike}
        onReturn={onReturn}
      />
      <View style={style.main}>
        <Heading />
        <Interests />
        <Gallery />
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: colors.primaryBackground,
    zIndex: 250,
  },
  profile_pic: {
    width: "100%",
    height: 0.56 * height,
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
  },
  main: {
    width: "91%",
    minHeight: height * 0.3,
    paddingVertical: "4.5%",
    paddingHorizontal: "8%",
    marginBottom: 50,
    alignSelf: "center",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 25,
    marginTop: 20,
  },
});

export default ProfilePreview;
