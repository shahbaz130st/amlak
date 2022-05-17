/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StatusBar, View, Text ,LogBox} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AuthStack from './src/navigations/application.stack';
import * as Common from './src/common/index';
const Store = Common.reduxInit();
import AppLoader from './src/components/appLoader';
import * as Constants from './src/constants/index';
import { navigationRef } from './src/services/navigationServices';
import NetInfo from "@react-native-community/netinfo";
import { checkVersion } from './src/constants/AppUtil';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn:
    // "https://6fd3e74226f14b2aaee5b13464ff2816@o990431.ingest.sentry.io/5946962",
  "https://1afcff59a3f843349713c6b402b3a782@o1238590.ingest.sentry.io/6389407",
  enableNative: true,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkStatus: true
    }
    Common.Translations.initConfig();
    console.log('Constants.API.Language', Constants.API.Language);
  }
  componentDidMount = () => {
    LogBox.ignoreAllLogs();
    checkVersion();
    NetInfo.addEventListener(state => {
      this.setState({ networkStatus: state.isConnected })
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    this.unsubscribe = dynamicLinks().onLink(this.handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(this.handleDynamicLink);
  }

  handleDynamicLink = (link) => {
    // Handle dynamic link inside your own application
    // if (link.url === "https://invertase.io/offer") {
    //   // ...navigate to your offers screen
    // }
    
    console.log(JSON.stringify(link), "link123");

    console.log(link, "link.url");

    // }
  };

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
