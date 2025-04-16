import { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import {
  useCharmrDispatch,
  useCharmrSelector,
} from "../../utility/store/store";

import { tokenFromStorageLoader } from "../../utility/store/slices/authentication";
import {
  filterInitiliazer,
  userDataInitializer,
} from "../../utility/store/slices/account";
import { ILoadUserRes } from "../../utility/interfaces/responses";
import { createStackNavigator } from "@react-navigation/stack";

import DatingSwiper from "./DatingSwiper";
import Likes from "./Likes";
import Messages from "./Messages";
import Profile from "./Profile";
import MatchPreview from "./components/dating_swiper/MatchPreview";

import RedirectionModal from "./components/others/RedirectionModal";
import Loading from "../others/Loading";

import { colors } from "../../utility/colors";
import { API_ROOT } from "../../App";
import {
  ApplicationStackParamList,
  AppTabsParamList,
  IRootNavProps,
} from "../../utility/interfaces/route_props";
import SignalRService from "../../utility/signalR_service/signalRService";
import Chat from "./components/messages/Chat";

const AppTabsNavigator = createBottomTabNavigator<AppTabsParamList>();
const BaseNavigator = createStackNavigator<ApplicationStackParamList>();

const AppTabs: React.FC = function () {
  return (
    <AppTabsNavigator.Navigator
      initialRouteName="main"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "main") {
            iconName = focused
              ? require("../../assets/icons/main_active.png")
              : require("../../assets/icons/main_inactive.png");
          } else if (route.name === "likes") {
            iconName = focused
              ? require("../../assets/icons/likes_active.png")
              : require("../../assets/icons/likes_inactive.png");
          } else if (route.name === "messages") {
            iconName = focused
              ? require("../../assets/icons/messages_active.png")
              : require("../../assets/icons/messages_inactive.png");
          } else if (route.name === "profile") {
            iconName = focused
              ? require("../../assets/icons/profile_active.png")
              : require("../../assets/icons/profile_inactive.png");
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    height: "200%",
                    aspectRatio: "1/1",
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                    zIndex: -1,
                    top: "50%",
                    transform: "translateY(-13.5%)",
                  }}
                />
              )}
              <Image
                source={iconName}
                style={{
                  aspectRatio: "1/1",
                  height: "95%",
                  resizeMode: "contain",
                  top: "55%",
                }}
              />
            </View>
          );
        },
        animation: "shift",
        headerShown: false,
        tabBarStyle: {
          height: "10%",
          borderTopWidth: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 15,
          justifyContent: "center",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingTop: "1%",
          paddingBottom: "2%",
        },
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: "transparent" }}
          />
        ),
      })}
    >
      <AppTabsNavigator.Screen name="main" component={DatingSwiper} />
      <AppTabsNavigator.Screen name="likes" component={Likes} />
      <AppTabsNavigator.Screen name="messages" component={Messages} />
      <AppTabsNavigator.Screen name="profile" component={Profile} />
    </AppTabsNavigator.Navigator>
  );
};

const Application: React.FC<IRootNavProps> = function ({ navigation }) {
  const dispatch = useCharmrDispatch();
  const { token } = useCharmrSelector((state) => state.authentication);
  const [loadingState, setLoadingState] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);

  const loadUser = async function () {
    setLoadingState(true);
    try {
      const response = await fetch(`${API_ROOT}/retrieve/load-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      switch (response.status) {
        case 200:
          const responseData: ILoadUserRes = await response.json();
          if (responseData.userData.credentials.verificationStatus) {
            dispatch(filterInitiliazer(responseData.userFiltering));
            dispatch(userDataInitializer(responseData.userData));
          } else {
            navigation.navigate("preferences");
          }
          break;
        case 401:
          setModalVisibility(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    dispatch(tokenFromStorageLoader());
    const signalRService = new SignalRService(dispatch);

    if (token) {
      loadUser();
      signalRService.initPressenceHub(token);
    }

    return () => {
      signalRService.terminatePresenceHub();
    };
  }, [token]);

  return loadingState ? (
    <Loading />
  ) : modalVisibility ? (
    <RedirectionModal />
  ) : (
    <BaseNavigator.Navigator
      initialRouteName="app"
      screenOptions={{ headerShown: false }}
    >
      <BaseNavigator.Screen name="app" component={AppTabs} />
      <BaseNavigator.Screen
        name="matches_preview"
        component={MatchPreview}
        options={{ animation: "fade" }}
      />
      <BaseNavigator.Screen name="chat" component={Chat} />
    </BaseNavigator.Navigator>
  );
};

export default Application;
