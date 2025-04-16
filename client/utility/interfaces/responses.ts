export interface IRegisterAuthenticationErrors {
  errors: {
    email?: string[];
    fullName?: string[];
    password?: string[];
    message?: string;
  };
}

export interface ILoginAuthenticationErrors {
  errors: {
    email?: string[];
    password?: string[];
  };
}

export interface ISuccessfullAuthentication {
  userId: string;
  token: string;
}

export interface IGeneralMessageRes {
  message: string;
}

export interface ILoadUserRes {
  userFiltering: {
    locationRadius: number;
    gender: "male" | "female" | "both";
    ageRange: number[];
  };
  userData: {
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
    profilePicture: { url: string; id: string };
    gallery: { url: string; id: string }[];
  };
}

export interface IPreviewProfileData {
  fullName: string;
  knownAs: string;
  about: string;
  age: number;
  gender: "male" | "female";
  sexuality: "heterosexual" | "homosexual" | "bisexual" | "without_preference";
  locationNormalized: string;
  interests: string[];
  profilePicture: { url: string; id: string };
  gallery: { url: string; id: string }[];
}

export interface RecipientDetails {
  recipientId: string;
  fullname: string;
  age: number;
  profilePic: string;
}
