import { useEffect } from "react";
import { BackHandler } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Register from "./Register";
import Login from "./Login";

import { AuthenticationParamsList } from "../../utility/interfaces/route_props";

const AuthenticateStack = createStackNavigator<AuthenticationParamsList>();

const Authenticate: React.FC = function () {
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <AuthenticateStack.Navigator
      initialRouteName="register"
      screenOptions={{ headerShown: false, animation: "reveal_from_bottom" }}
    >
      <AuthenticateStack.Screen name="register" component={Register} />
      <AuthenticateStack.Screen name="login" component={Login} />
    </AuthenticateStack.Navigator>
  );
};

export default Authenticate;
