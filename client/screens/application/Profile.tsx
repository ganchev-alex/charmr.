import { useState } from "react";
import { ScrollView } from "react-native";
import ProfileHeader from "./components/main_profile/ProfileHeader";
import ProfilePreview from "./components/main_profile/ProfilePreview";
import Gallery from "./components/main_profile/Gallery";
import ProfileControls from "./components/main_profile/ProfileControls";
import LogOutModal from "./components/main_profile/LogOutModal";
import EditProfile from "./components/main_profile/EditProfile";

const Profile: React.FC = function () {
  const [controlModalVisibility, setControlModalVisibility] = useState(false);
  const [editingFormVisibility, setEditingFormVisibility] = useState(false);

  return (
    <ScrollView>
      {editingFormVisibility ? (
        <EditProfile onCloseEditor={() => setEditingFormVisibility(false)} />
      ) : (
        <>
          <ProfileHeader
            onOpenEditingForm={() => setEditingFormVisibility(true)}
          />
          <ProfilePreview />
          <Gallery />
          <ProfileControls
            onShowControlModal={() => setControlModalVisibility(true)}
          />
          {controlModalVisibility && (
            <LogOutModal
              onCloseModal={() => setControlModalVisibility(false)}
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Profile;
