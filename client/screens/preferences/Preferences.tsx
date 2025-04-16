import { createStackNavigator } from "@react-navigation/stack";

import Sex from "./Gender";
import VerificationGreeting from "./VerificationGreeting";
import Sexuality from "./Sexuality";
import Age from "./Age";
import Location from "./Location";
import Picture from "./Picture";
import Interests from "./Interests";
import Verified from "./Verified";

const PreferenceStack = createStackNavigator();

const Preferences: React.FC = function () {
  return (
    <PreferenceStack.Navigator
      initialRouteName="verification_greeting"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <PreferenceStack.Screen
        name="verification_greeting"
        component={VerificationGreeting}
      />
      <PreferenceStack.Screen
        name="gender"
        component={Sex}
        options={{ animation: "slide_from_right" }}
      />
      <PreferenceStack.Screen name="sexuality" component={Sexuality} />
      <PreferenceStack.Screen name="age" component={Age} />
      <PreferenceStack.Screen name="location" component={Location} />
      <PreferenceStack.Screen name="picture" component={Picture} />
      <PreferenceStack.Screen name="interests" component={Interests} />
      <PreferenceStack.Screen name="verified" component={Verified} />
    </PreferenceStack.Navigator>
  );
};

export default Preferences;
