import React, { Component } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Screens from '../../constants/navigations';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { CommonActions } from '@react-navigation/native';

class Splash extends Component {
  async componentDidMount() {
    await dynamicLinks().onLink(this.handleDynamicLink);
    await dynamicLinks()
      .getInitialLink()
      .then(this.handleDynamicLink);
  }

  handleDynamicLink = async (link) => {
    console.log(JSON.stringify(link), "link123");
    console.log(link, "link.url");
    if (link !== null) {
      let stringArray = link.url.split("/")
      console.log(stringArray[stringArray.length - 2])
      console.log(Constants.Navigations.Dashboard.DETAIL)
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: Screens.Onboarding.DASHBOARD },
            {
              name: Constants.Navigations.Dashboard.DETAIL,
              params: { id: stringArray[stringArray.length - 2] },
            },
          ],
        })
      );
      // this.props.navigation.navigate(
      //   Constants.Navigations.Dashboard.DETAIL,
      //   { id: stringArray[stringArray.length - 2] },
      // );
    }
    else {
      let token = await Common.KeyChain.get('authToken');
      this.checkPermission();
      setTimeout(() => {
        if (token != null) {
          Constants.API.Token = token;
          console.log('token--->', token);
          this.props.navigation.navigate(Screens.Onboarding.DASHBOARD);
        } else {
          // this.props.navigation.push(Screens.Onboarding.WELCOME);
          this.props.navigation.navigate(Screens.Onboarding.DASHBOARD);
        }
      }, 3000)
    }
  };

  async checkPermission() {
    this.requestUserPermission();

    // const enabled = await messaging().hasPermission();
    // if (enabled) {
    //   this.getToken();
    // } else {
    //   this.requestUserPermission();
    // }
  }

  requestUserPermission = async () => {
    console.log('Authorization status==');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getToken(); //<---- Add this
      this.createNotificationListeners();
    }
  };

  getToken = async () => {
    try {
      const authStatus = await messaging().registerDeviceForRemoteMessages();
      if (authStatus) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          // user has a device token
          Constants.API.FirebaseToken = fcmToken;
          if (Constants.API.Token) {
            Services.UserServices.deviceinfo(fcmToken);
          }
        }
        messaging().onTokenRefresh((token) => {
          Constants.API.FirebaseToken = token;
          if (Constants.API.Token) {
            Services.UserServices.deviceinfo(token);
          }
        });
      }
    } catch (error) { }
  };
  handelPushNotification = async (chatId) => { };

  createNotificationListeners = async () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('remoteMessage:Back ', remoteMessage);
      this.handelPushNotification(
        remoteMessage
      );
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('remoteMessage: Open', remoteMessage);
      this.handelPushNotification(
        remoteMessage
      );
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('remoteMessage: Initial', remoteMessage);
          this.handelPushNotification(
            remoteMessage
          );
        }
      });

    messaging().onMessage((message) => {
      console.log('onMessage: ', message);
      // show local notification here---------
      if (message.notification.body != null) {
        this.showAlert(message.notification.title, message.notification.body);
      }
    });
  };

  showAlert = (title, message) => {
    Alert.alert(`${title}`, `${message}`, [
      {
        text: Common.Translations.translate('ok'),
        onPress: () => console.log('OK Pressed'),
      },
    ]);
  };
  // async requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     this.getToken();
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={Constants.Images.splash}
        />
      </View>
    );
  }
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
