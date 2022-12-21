/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StatusBar, View, Text, LogBox, Platform, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AuthStack from './src/navigations/application.stack';
import * as Common from './src/common/index';
const Store = Common.reduxInit();
import AppLoader from './src/components/appLoader';
import { navigationRef } from './src/services/navigationServices';
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import RNRestart from 'react-native-restart';
import {Settings} from 'react-native-fbsdk-next';
Sentry.init({
  dsn:
    // "https://6fd3e74226f14b2aaee5b13464ff2816@o990431.ingest.sentry.io/5946962",
    "https://1afcff59a3f843349713c6b402b3a782@o1238590.ingest.sentry.io/6389407",
  enableNative: true,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.inAppUpdates = new SpInAppUpdates(
      true // debug verbosely
    );
    this.state = {
      networkStatus: true
    }
    Common.Translations.initConfig();
  }
  componentDidMount = async () => {
    Settings.setAdvertiserTrackingEnabled(true);
    this.checkAppUpdate();
    if (I18nManager.isRTL == true) {
      await Common.Translations.getDefaultLanguage();
      RNRestart.Restart()
    }
    LogBox.ignoreAllLogs();
    NetInfo.addEventListener(state => {
      this.setState({ networkStatus: state.isConnected })
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
  }

  checkAppUpdate = () => {
    //   if(Platform.OS=="android"){
    //   // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    //  this.inAppUpdates.checkNeedsUpdate().then((result) => {
    //     // console.log("checkAppUpdate", result.shouldUpdate, result.storeVersion)
    //     if (result.shouldUpdate) {
    //       let updateOptions: StartUpdateOptions = {};
    //       if (Platform.OS === 'android') {
    //         // android only, on iOS the user will be promped to go to your app store page
    //         updateOptions = {
    //           updateType: IAUUpdateKind.FLEXIBLE,
    //         };
    //       }
    //       this.inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
    //     }
    //   });
    // }else{
    this.inAppUpdates.checkNeedsUpdate().then(result => {
      if (result.shouldUpdate) {
        const updateOptions: StartUpdateOptions = Platform.select({
          ios: {
            title: 'Update available',
            message: "There is a new version of the app available on the App Store, do you want to update it?",
            buttonUpgradeText: 'Update',
            buttonCancelText: 'Cancel'
          },
          android: {
            updateType: IAUUpdateKind.FLEXIBLE,
          },
        });
        this.inAppUpdates.startUpdate(updateOptions);
      }
    })
      .catch(error => {
        // alert(error)
        console.log("inappupdate catch error", error)
      })
  }

  render() {
    return (
      <Provider store={Store}>
        {this.state.networkStatus ? <NavigationContainer ref={navigationRef}>
          <StatusBar barStyle="dark-content" />
          <AppLoader />
          <AuthStack />
        </NavigationContainer>
          :
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }}>{`${Common.Translations.translate('no_internet')}`}</Text>
          </View>
        }
      </Provider>
    );
  }
}

export default App;
