import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { NavigationContainer } from "@react-navigation/native";
import * as Screens from "../screens/index";
import * as Constants from "../constants/index";
import * as Common from "../common/index";
import Animated from "react-native-reanimated";
import Dashboard from "../screens/landing/dashboard";

const _renderIcon = (routeName, selectedTab) => {
  let icon = "";

  switch (routeName) {
    case "main":
      icon = selectedTab
        ? Constants.Images.mainSelected
        : Constants.Images.main;
      break;

    case "Provinces":
      icon = selectedTab
        ? Constants.Images.provincesSelected
        : Constants.Images.provinces;
      break;
    case "المحافظات":
      icon = selectedTab
        ? Constants.Images.provincesSelected
        : Constants.Images.provinces;
      break;

    case "Favorite":
      icon = selectedTab
        ? Constants.Images.favoriteSelected
        : Constants.Images.favorite;
      break;
    case "المفضلة":
      icon = selectedTab
        ? Constants.Images.favoriteSelected
        : Constants.Images.favorite;
      break;
    case "More":
      icon = selectedTab
        ? Constants.Images.moreSelected
        : Constants.Images.more;
      break;
    case "المزيد":
      icon = selectedTab
        ? Constants.Images.moreSelected
        : Constants.Images.more;
      break;
  }

  return (
    <>
      <Image
        source={icon}
        style={{
          height: 20,
          width: 20,
          tintColor: routeName === selectedTab ? "#006FEB" : "gray",
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          fontSize: 10,
          marginTop: 3,
          fontFamily: Constants.Fonts.shamel,
          letterSpacing: 1,
          color: routeName === selectedTab ? "#006FEB" : "gray",
        }}
      >
        {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
      </Text>
    </>
    // <Ionicons
    //   name={icon}
    //   size={25}
    //   color={routeName === selectedTab ? "black" : "gray"}
    // />
  );
};
const renderTabBar = ({ routeName, selectedTab, navigate }) => {
  console.log("routeName", routeName);
  return (
    <TouchableOpacity
      onPress={() => navigate(routeName)}
      style={styles.tabbarItem}
    >
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );
};

const DashboardStack = (props) => (
  <CurvedBottomBarExpo.Navigator
    type="DOWN"
    style={styles.bottomBar}
    shadowStyle={styles.shawdow}
    height={70}
    circleWidth={20}
    bgColor="white"
    initialRouteName={Common.Translations.translate(
      Constants.Navigations.Dashboard.MAIN
    )}
    borderTopLeftRight
    renderCircle={({ selectedTab, navigate }) => (
      <Animated.View style={styles.btnCircleUp}>
        <TouchableOpacity
          style={styles.button}
          // onPress={() => props.navigation.push(Screens.AddNew)}
          onPress={
            () => navigate(Constants.Navigations.Dashboard.AddNEW)
            // props.navigation.dispatch(mainApp);
          }
        >
          <Image
            source={Constants.Images.plus}
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>
      </Animated.View>
    )}
    tabBar={renderTabBar}
  >
    <CurvedBottomBarExpo.Screen
      name={Constants.Navigations.Dashboard.MAIN}
      component={Screens.Dashboard}
      position="LEFT"
    />

    {Constants.API.Token != null && (
      <CurvedBottomBarExpo.Screen
        name={Common.Translations.translate(
          Constants.Navigations.Dashboard.PROVINCES
        )}
        component={Screens.Provinces}
        position="LEFT"
      />
    )}
    <CurvedBottomBarExpo.Screen
      name={Common.Translations.translate(
        Constants.Navigations.Dashboard.AddNEW
      )}
      component={Screens.AddNew}
      position="CENTER"
    />
    {Constants.API.Token != null && (
      <CurvedBottomBarExpo.Screen
        name={Common.Translations.translate(
          Constants.Navigations.Dashboard.FAVORITE
        )}
        component={Screens.Favorite}
        position="RIGHT"
      />
    )}

    <CurvedBottomBarExpo.Screen
      name={Common.Translations.translate(Constants.Navigations.Dashboard.MORE)}
      component={Screens.More}
      position="RIGHT"
    />
  </CurvedBottomBarExpo.Navigator>
);
// <Tab.Navigator
//   initialRouteName={Common.Translations.translate(
//     Constants.Navigations.Dashboard.MAIN
//   )}
//   screenOptions={({ route }) => ({
//     tabBarIcon: ({ focused, color, size }) => {
//       let iconName;
//       if (
//         route.name ===
//         Common.Translations.translate(Constants.Navigations.Dashboard.MAIN)
//       ) {
//         iconName = focused
//           ? Constants.Images.mainSelected
//           : Constants.Images.main;
//       } else if (
//         route.name ===
//           Common.Translations.translate(
//             Constants.Navigations.Dashboard.PROVINCES
//           ) &&
//         Constants.API.Token != null
//       ) {
//         iconName = focused
//           ? Constants.Images.provincesSelected
//           : Constants.Images.provinces;
//       } else if (route.name === Constants.Navigations.Dashboard.AddNEW) {
//         iconName = focused ? Constants.Images.plus : Constants.Images.plus;
//       } else if (
//         route.name ===
//           Common.Translations.translate(
//             Constants.Navigations.Dashboard.FAVORITE
//           ) &&
//         Constants.API.Token != null
//       ) {
//         iconName = focused
//           ? Constants.Images.favoriteSelected
//           : Constants.Images.favorite;
//       } else if (
//         route.name ===
//         Common.Translations.translate(Constants.Navigations.Dashboard.MORE)
//       ) {
//         iconName = focused
//           ? Constants.Images.moreSelected
//           : Constants.Images.more;
//       }

//       // You can return any component that you like here!
//       return route.name != Constants.Navigations.Dashboard.AddNEW ? (
//         <Image source={iconName} />
//       ) : (
//         <View
//           style={{
//             marginTop: 15,
//             width: 40,
//             height: 40,
//             borderRadius: 20,
//             backgroundColor: "#006FEB",
//             overflow: "hidden",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Image source={iconName} />
//         </View>
//       );
//     },
//   })}
//   tabBarOptions={{
//     activeTintColor: "#006FEB",
//     inactiveTintColor: "#989898",
//   }}
// >
//   <Tab.Screen
//     name={Common.Translations.translate(Constants.Navigations.Dashboard.MORE)}
//     component={Screens.More}
//   />
//   {Constants.API.Token != null && (
//     <Tab.Screen
//       name={Common.Translations.translate(
//         Constants.Navigations.Dashboard.FAVORITE
//       )}
//       component={Screens.Favorite}
//     />
//   )}

//   <Tab.Screen
//     options={{ tabBarLabel: "" }}
//     name={Constants.Navigations.Dashboard.AddNEW}
//     component={Screens.AddNew}
//   />
//   {Constants.API.Token != null && (
//     <Tab.Screen
//       name={Common.Translations.translate(
//         Constants.Navigations.Dashboard.PROVINCES
//       )}
//       component={Screens.Provinces}
//     />
//   )}

//   <Tab.Screen
//     name={Common.Translations.translate(Constants.Navigations.Dashboard.MAIN)}
//     component={Screens.Dashboard}
//   />
// </Tab.Navigator>

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {
    // height: 60,
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006feb",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    // justifyContent: "center",
  },
  img: {
    width: 20,
    height: 20,
  },
});
export default DashboardStack;
