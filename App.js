import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  StatusBar,
  View,
  Text,
  LogBox,
  Platform,
  I18nManager,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import AuthStack from "./src/navigations/application.stack";
import * as Common from "./src/common/index";
const Store = Common.reduxInit();
import AppLoader from "./src/components/appLoader";
import { navigationRef } from "./src/services/navigationServices";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import RNRestart from "react-native-restart";
import { Settings } from "react-native-fbsdk-next";

Sentry.init({
  dsn: "https://1afcff59a3f843349713c6b402b3a782@o1238590.ingest.sentry.io/6389407",
  enableNative: true,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkStatus: true,
    };
    Common.Translations.initConfig();
  }
  componentDidMount = async () => {
    crashlytics().log("App mounted");

    await crashlytics().setCrashlyticsCollectionEnabled(true);
    Settings.setAdvertiserTrackingEnabled(true);
    if (I18nManager.isRTL == true) {
      await Common.Translations.getDefaultLanguage();
      RNRestart.Restart();
    }
    LogBox.ignoreAllLogs();
    NetInfo.addEventListener((state) => {
      this.setState({ networkStatus: state.isConnected });
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
  };

  render() {
    return (
      <Provider store={Store}>
        {this.state.networkStatus ? (
          <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle="dark-content" />
            <AppLoader />
            <AuthStack />
          </NavigationContainer>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center" }}
            >{`${Common.Translations.translate("no_internet")}`}</Text>
          </View>
        )}
      </Provider>
    );
  }
}

export default Sentry.wrap(App);

// import React, { useEffect } from "react";
// import { View, Button } from "react-native";
// import crashlytics from "@react-native-firebase/crashlytics";
// // import Fabric from "react-native-fabric";

// async function onSignIn(user) {
//   crashlytics().log("User signed in.");
//   await Promise.all([
//     crashlytics().setUserId(user.uid),
//     crashlytics().setAttribute("credits", String(user.credits)),
//     crashlytics().setAttributes({
//       role: "admin",
//       followers: "13",
//       email: user.email,
//       username: user.username,
//     }),
//   ]);
// }

// export default function App() {
//   // var { Crashlytics } = Fabric;
//   useEffect(() => {
//     // Crashlytics.crash();
//   }, []);

//   return (
//     <SafeAreaView>
//       <Button
//         title="Sign In"
//         onPress={() =>
//           onSignIn({
//             uid: "Aa0Bb1Cc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9",
//             username: "Joaquin Phoenix",
//             email: "phoenix@example.com",
//             credits: 42,
//           })
//         }
//       />
//       <Button title="Test Crash" onPress={() => crashlytics().crash()} />
//     </SafeAreaView>
//   );
// }
