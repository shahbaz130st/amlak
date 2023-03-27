import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import * as Constants from "../constants/index";
import * as Screens from "../screens/index";
import { Navigations } from "../constants/index";
import { TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Dashboard from "./dashboard.stack";

const { Navigator, Screen } = createStackNavigator();

const AuthStack = () => (
  <Navigator
    headerMode="screen"
    screenOptions={{
      headerTitle: null,
      headerStyle: {
        backgroundColor: "white",
      },
      headerTintColor: "#fff",
    }}
  >
    <Screen
      name={Navigations.Onboarding.SPLASH}
      component={Screens.Splash}
      options={{
        headerShown: false,
      }}
    />
    <Screen
      name={Navigations.Onboarding.WELCOME}
      component={Screens.Welcome}
      options={{
        animationEnabled: false,
        gestureEnabled: false,
        headerShown: false,
      }}
    />
    <Screen
      name={Navigations.Onboarding.LOGIN}
      component={Screens.Login}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
          >
            <Image
              source={Constants.Images.rightArrow}
              style={{
                width: wp("6%"),
                height: wp("6%"),
                marginRight: wp("2%"),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
      })}
    />

    <Screen
      name={Navigations.Onboarding.SIGNUP}
      component={Screens.Signup}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        //   headerRight: () => (
        //     <TouchableOpacity>
        //            <Image source = {Constants.Images.rightArrow} style = {{width:64,height:30}} resizeMode = 'contain'/>
        //        </TouchableOpacity>
        //   ),
      })}
    />
    <Screen
      name={Navigations.Onboarding.VERIFICATION}
      component={Screens.Verificaton}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
          >
            <Image
              source={Constants.Images.rightArrow}
              style={{
                width: wp("6%"),
                height: wp("6%"),
                marginRight: wp("2%"),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
      })}
    />
    <Screen
      name={Navigations.Rating.Rating}
      component={Screens.Rating}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        animationEnabled: false,
        gestureEnabled: false,
        headerLeft: () => null,
      })}
    />
    <Screen
      name={Navigations.Onboarding.DASHBOARD}
      component={Dashboard}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        animationEnabled: false,
        gestureEnabled: false,
        headerLeft: () => null,
      })}
    />
    <Screen
      name={Navigations.Dashboard.DETAIL}
      component={Screens.EstateDetail}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
      })}
    />
    <Screen
      name={Navigations.Dashboard.FILTER}
      component={Screens.Filter}
      options={({ navigation, route }) => ({
        animationEnabled: false,
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />

    <Screen
      name={Navigations.Setting.PROFILE}
      component={Screens.Profile}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
    <Screen
      name={Navigations.Property.Category}
      component={Screens.Property}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />

    <Screen
      name={Navigations.Setting.MY_ADS}
      component={Screens.MyAds}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />

    <Screen
      name={Navigations.Setting.SETTING}
      component={Screens.Setting}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
    <Screen
      name={Navigations.Setting.LANGUAGE}
      component={Screens.Language}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
    <Screen
      name={Navigations.Setting.EDIT_PROFILE}
      component={Screens.EditProfile}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
    <Screen
      name={Navigations.Dashboard.MESSAGE}
      component={Screens.PostAdded}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
    <Screen
      name={Navigations.Setting.HELP}
      component={Screens.Help}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />

    <Screen
      name={Navigations.Dashboard.AddNEW}
      component={Screens.AddNew}
      options={({ navigation, route }) => ({
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      })}
    />
  </Navigator>
);

export default AuthStack;
