import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  welcome: undefined;
  authenticate: undefined;
  preferences: undefined;
  app: undefined;
};

export type IRootNavigation = StackNavigationProp<
  RootStackParamList,
  "welcome" | "authenticate" | "preferences" | "app"
>;

export interface IRootNavProps {
  navigation: IRootNavigation;
}

export type WelcomeStackParamList = {
  greetings: {
    asset: string;
    titleIcon: string;
    title: string;
    message: string;
    buttonLabel: string;
    nextRoute: "profiles";
  };
  profiles: {
    asset: string;
    titleIcon: string;
    title: string;
    message: string;
    buttonLabel: string;
    nextRoute: "chat";
  };
  chat: {
    asset: string;
    titleIcon: string;
    title: string;
    message: string;
    buttonLabel: string;
    nextRoute: "parent";
  };
};

export interface IWelcomeProps {
  navigation: StackNavigationProp<
    WelcomeStackParamList,
    "greetings" | "profiles" | "chat"
  >;
  route: RouteProp<WelcomeStackParamList, "greetings" | "profiles" | "chat">;
}

export type AuthenticationParamsList = {
  register: undefined;
  login: undefined;
};

export type INavigationAuthenticationProps = StackNavigationProp<
  AuthenticationParamsList,
  "login" | "register"
>;

export interface IAuthenticationProps {
  navigation: INavigationAuthenticationProps;
  route: RouteProp<AuthenticationParamsList, "login" | "register">;
}

export type PreferencesParamsList = {
  greeting: undefined;
  gender: undefined;
  sexuality: undefined;
  age: undefined;
  location: undefined;
  picture: undefined;
  interests: undefined;
  verified: undefined;
};

export type INavigationPreferenceProps = StackNavigationProp<
  PreferencesParamsList,
  | "greeting"
  | "gender"
  | "sexuality"
  | "age"
  | "location"
  | "picture"
  | "interests"
  | "verified"
>;

export interface IPreferencesProps {
  navigation: INavigationPreferenceProps;
}

export type ApplicationStackParamList = {
  app: NavigatorScreenParams<AppTabsParamList>;
  profile_preview: { userId: string };
  matches_preview: undefined;
  chat: { userId: string };
};

export interface IApplicationProps {
  navigation: StackNavigationProp<
    ApplicationStackParamList,
    "app" | "matches_preview" | "profile_preview" | "chat"
  >;
  route: RouteProp<
    ApplicationStackParamList,
    "app" | "matches_preview" | "profile_preview" | "chat"
  >;
}

export type AppTabsParamList = {
  main: undefined;
  likes: undefined;
  messages: { recipientId: string };
  profile: undefined;
};

export interface IAppTabsProps {
  navigation: BottomTabNavigationProp<AppTabsParamList, keyof AppTabsParamList>;
  route: RouteProp<AppTabsParamList, keyof AppTabsParamList>;
}
