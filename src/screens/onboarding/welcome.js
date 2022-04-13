import React, {Component} from 'react';
import {View, Text, StyleSheet, Image,BackHandler} from 'react-native';
import * as Components from '../../components/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Common from '../../common/index';
import * as Constants from '../../constants/index';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    Common.Helper.logEvent('welcome', {
    });
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

handleBackButton() {
    return true;
}
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={Constants.Images.welcomeLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View
          style={{
            width: '100%',
            height: '15%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('5.3%'),
              paddingVertical: wp('2%'),
            }}>
            {Common.Translations.translate('welcomeTitle')}
          </Text>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp('3.2%'),
              paddingVertical: wp('1%'),
              width: wp('90%'),
              textAlign: 'center',
              color: Constants.Colors.lightgray,
            }}>
            {Common.Translations.translate('welcomeSubtile')}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: '20%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{marginVertical: wp('4%')}}>
            <Components.AmlakButton
              title="login"
              titleStyles={{color: Constants.Colors.white}}
              containerStyles={{
                backgroundColor: Constants.Colors.buttonBackground,
                width:wp('90%')
              }}
              onClick={() =>
                this.props.navigation.push(
                  Constants.Navigations.Onboarding.LOGIN,
                )
              }
            />
          </View>
          <View>
            <Components.AmlakButton
              title="signup"
              titleStyles={{color: Constants.Colors.buttonBackground}}
              containerStyles={{
                backgroundColor: Constants.Colors.white,
                borderColor: Constants.Colors.buttonBackground,
                borderWidth: 1,
                width:wp('90%')
              }}
              onClick={() =>  this.props.navigation.push(
                  Constants.Navigations.Onboarding.SIGNUP,
                )}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
  },
  logo: {
    width: wp('75%'),
    height: wp('75%'),
  },
});
