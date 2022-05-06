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
