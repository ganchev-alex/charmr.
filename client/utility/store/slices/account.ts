import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeCard, Match, SwipeCardData } from "../../interfaces/data_types";

interface IAccountDataManagementState {
  loadedUserData: {
    credentials: {
      email: string;
      fullName: string;
      verificationStatus: boolean;
    };
    details: {
      knownAs: string;
      about: string;
      age: number;
      gender: "male" | "female";
      sexuality:
        | "heterosexual"
        | "homosexual"
        | "bisexual"
        | "without_preference";
      locationNormalized: string;
      interests: string[];
    };
    profilePicture: { id: string; url: string };
    gallery: { id: string; url: string }[];
  };
  fetchedDataStorage: {
    deck: SwipeCardData[];
    likesReceived: LikeCard[];
    likesGiven: LikeCard[];
  };
  filters: {
    locationRadius: number;
    gender: "male" | "female" | "both";
    ageRange: number[];
  };
  profilePreviewData: {
    fullName: string;
    knownAs: string;
    about: string;
    age: number;
    gender: "male" | "female";
    sexuality:
      | "heterosexual"
      | "homosexual"
      | "bisexual"
      | "without_preference";
    locationNormalized: string;
    interests: string[];
    profilePicture: { url: string; id: string };
    gallery: { url: string; id: string }[];
  };
  swipingHistory: {
    actionType: "like" | "pass" | "super_like";
    likedId: string;
  }[];
  newMatches: Match[];
  matches: Match[];
}

const initialState: IAccountDataManagementState = {
  loadedUserData: {
    credentials: {
      email: "",
      fullName: "",
      verificationStatus: false,
    },
    details: {
      knownAs: "",
      about: "",
      age: 18,
      gender: "male",
      sexuality: "heterosexual",
      locationNormalized: "",
      interests: [],
    },
    profilePicture: { id: "", url: "" },
    gallery: [],
  },
  fetchedDataStorage: {
    deck: [],
    likesReceived: [],
    likesGiven: [],
  },
  filters: {
    locationRadius: 30,
    gender: "both",
    ageRange: [18, 50],
  },
  profilePreviewData: {
    fullName: "",
    knownAs: "",
    about: "",
    age: 18,
    gender: "male",
    sexuality: "heterosexual",
    locationNormalized: "",
    interests: [],
    profilePicture: { url: "", id: "" },
    gallery: [],
  },
  swipingHistory: [],
  newMatches: [],
  matches: [],
};

const accountDataManagementSlice = createSlice({
  name: "account_data_management",
  initialState,
  reducers: {
    userDataInitializer: (
      state,
      action: PayloadAction<IAccountDataManagementState["loadedUserData"]>
    ) => {
      state.loadedUserData = action.payload;
    },
    filterInitiliazer: (
      state,
      action: PayloadAction<{
        locationRadius: number;
        gender: "male" | "female" | "both";
        ageRange: number[];
      }>
    ) => {
      state.filters = { ...action.payload };
    },
    filterModifier: (
      state,
      action: PayloadAction<{
        key: keyof IAccountDataManagementState["filters"];
        value: IAccountDataManagementState["filters"][typeof action.payload.key];
      }>
    ) => {
      state.filters[action.payload.key] = action.payload.value as never;
    },
    fetchedDataStorageModifier: (
      state,
      action: PayloadAction<{
        key: keyof IAccountDataManagementState["fetchedDataStorage"];
        value: IAccountDataManagementState["fetchedDataStorage"][typeof action.payload.key];
      }>
    ) => {
      state.fetchedDataStorage[action.payload.key] = action.payload
        .value as any;
    },
    swipingHistoryAppender: (
      state,
      action: PayloadAction<{
        actionType: "like" | "pass" | "super_like";
        cardIndex: number;
      }>
    ) => {
      state.swipingHistory.push({
        actionType: action.payload.actionType,
        likedId: state.fetchedDataStorage.deck[action.payload.cardIndex].userId,
      });
    },
    swipingHistoryReverter: (state) => {
      state.swipingHistory.pop();
    },
    swipingHistoryReseter: (state) => {
      state.swipingHistory = [];
    },
    givenLikeRemover: (state, action: PayloadAction<string>) => {
      state.fetchedDataStorage.likesGiven =
        state.fetchedDataStorage.likesGiven.filter(
          (like) => like.userId != action.payload
        );
    },
    recievedLikeRemover: (state, action: PayloadAction<string>) => {
      state.fetchedDataStorage.likesReceived =
        state.fetchedDataStorage.likesReceived.filter(
          (like) => like.userId != action.payload
        );
    },
    profilePreviewLoader: (
      state,
      action: PayloadAction<IAccountDataManagementState["profilePreviewData"]>
    ) => {
      state.profilePreviewData = action.payload;
    },
    newPhotoAppender: (
      state,
      action: PayloadAction<{ id: string; url: string }>
    ) => {
      state.loadedUserData.gallery.push(action.payload);
    },
    profilePictureModifier: (state, action: PayloadAction<string>) => {
      const newProfilePicture = state.loadedUserData.gallery.find(
        (pic) => pic.id === action.payload
      );

      if (newProfilePicture)
        state.loadedUserData.profilePicture = newProfilePicture;
    },
    pictureRemover: (state, action: PayloadAction<string>) => {
      state.loadedUserData.gallery = state.loadedUserData.gallery.filter(
        (pic) => pic.id != action.payload
      );
    },
    updateDataSuccessor: (
      state,
      action: PayloadAction<{
        knownAs: string;
        about: string;
        locationNormalized: string;
        interests: string[];
      }>
    ) => {
      state.loadedUserData.details = {
        ...state.loadedUserData.details,
        ...action.payload,
      };
    },
    newMatchesSetter: (state, action: PayloadAction<Match[]>) => {
      state.newMatches = action.payload;
    },
    matchesSetter: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
  },
});

export const {
  userDataInitializer,
  filterInitiliazer,
  filterModifier,
  fetchedDataStorageModifier,
  swipingHistoryAppender,
  swipingHistoryReverter,
  swipingHistoryReseter,
  givenLikeRemover,
  recievedLikeRemover,
  profilePreviewLoader,
  newPhotoAppender,
  profilePictureModifier,
  pictureRemover,
  updateDataSuccessor,
  newMatchesSetter,
  matchesSetter,
} = accountDataManagementSlice.actions;
export default accountDataManagementSlice.reducer;
