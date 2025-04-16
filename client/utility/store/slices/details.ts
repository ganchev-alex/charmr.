import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as ImagePickerTools from "expo-image-picker";

interface IDetailsManagementState {
  verification: {
    birthYear: number;
    gender: "male" | "female" | "";
    sexuality:
      | "heterosexual"
      | "homosexual"
      | "bisexual"
      | "without_preference"
      | "";
    latitude: number;
    longitude: number;
    locationNormalized: string;
    profilePic: ImagePickerTools.ImagePickerAsset;
  };
  updatedDetailsPayload: {
    email: string;
    knownAs: string;
    about: string;
    latitude: number;
    longitude: number;
    locationNormalized: string;
    interests: string[];
  };
}

const initialState: IDetailsManagementState = {
  verification: {
    birthYear: 1950,
    gender: "",
    sexuality: "",
    latitude: 0.0,
    longitude: 0.0,
    locationNormalized: "",
    profilePic: { uri: "", height: 100, width: 100 },
  },
  updatedDetailsPayload: {
    email: "",
    knownAs: "",
    about: "",
    latitude: 0.0,
    longitude: 0.0,
    locationNormalized: "",
    interests: [],
  },
};

const detailsManagementSlice = createSlice({
  name: "details_management",
  initialState,
  reducers: {
    verificationStateModifier: (
      state,
      action: PayloadAction<{
        key: keyof IDetailsManagementState["verification"];
        value: IDetailsManagementState["verification"][typeof action.payload.key];
      }>
    ) => {
      state.verification[action.payload.key] = action.payload.value as never;
    },
    updatedDetailsPayloadModifier: (
      state,
      action: PayloadAction<{
        key: keyof IDetailsManagementState["updatedDetailsPayload"];
        value: IDetailsManagementState["updatedDetailsPayload"][typeof action.payload.key];
      }>
    ) => {
      state.updatedDetailsPayload[action.payload.key] = action.payload
        .value as never;
    },
    updatedInterestsModifier: (state, action: PayloadAction<string>) => {
      const modifyMode = state.updatedDetailsPayload.interests.includes(
        action.payload
      );

      if (modifyMode) {
        state.updatedDetailsPayload.interests =
          state.updatedDetailsPayload.interests.filter(
            (i) => i != action.payload
          );
      } else {
        state.updatedDetailsPayload.interests.push(action.payload);
      }
    },
    updatedDetailsPayloadReseter: (state) => {
      state.updatedDetailsPayload = initialState.updatedDetailsPayload;
    },
  },
});

export const {
  verificationStateModifier,
  updatedDetailsPayloadModifier,
  updatedInterestsModifier,
  updatedDetailsPayloadReseter,
} = detailsManagementSlice.actions;
export default detailsManagementSlice.reducer;
