import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import User from '../../models/user';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';
import { CommonActions } from '@react-navigation/native';
import Share from 'react-native-share';
const url = Platform.OS === "android" ? "https://play.google.com/store/apps/details?id=com.app.amlak" : "https://apps.apple.com/il/app/%D8%A3%D9%85%D9%84%D8%A7%D9%83-%D8%A8%D9%8A%D8%B9-%D9%88%D8%AA%D8%A7%D8%AC%D9%8A%D8%B1-%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA/id1553908741?l=iw";
const options = {
  url
};
class More extends Component {
  state = {
    isDisplayContact: false
  };

  async componentDidMount() {
    let token = await Common.KeyChain.get('authToken');
    if (token != null) {
      this.props.toggleLoader(true);
      Constants.API.Token = token;
      let userRes = await Services.AuthServices.userData();
      this.props.toggleLoader(false);
      if (userRes) {
        let userInstance = User.getInstance();
        userInstance.setUser(userRes);
      }
    }
    Common.Helper.logEvent('more', {});
    this.props.navigation.addListener('focus', async () => {
      let token = await Common.KeyChain.get('authToken');
      if (token != null) {
        Constants.API.Token = token;
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          title={Common.Translations.translate(
            Constants.Navigations.Dashboard.MORE,
          )}
        />
        <View style={{ marginTop: wp('3%'), backgroundColor: '#FDFDFD' }}>
          {Constants.API.Token != null ? (
            <React.Fragment>
              <View
                style={{
                  width: '80%',
                  marginBottom: wp('5%'),
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    this.props.navigation.push(
                      Constants.Navigations.Setting.PROFILE,
                    );
                  }}>
                  <Image source={Constants.Images.arrowDetail} />
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('3%'),
                      marginLeft: wp('4%'),
                      width: wp('60%'),
                      textAlign: 'right',
                    }}>
                    {' '}
                    {Common.Translations.translate('arithmetic')}{' '}
                  </Text>
                  <Image source={Constants.Images.user} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '80%',
                  marginBottom: wp('5%'),
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    this.props.navigation.push(
                      Constants.Navigations.Setting.MY_ADS,
                    );
                  }}>
                  <Image source={Constants.Images.arrowDetail} />
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('3%'),
                      marginLeft: wp('4%'),
                      width: wp('60%'),
                      textAlign: 'right',
                    }}>
                    {' '}
                    {Common.Translations.translate('myProperty')}{' '}
                  </Text>
                  <Image source={Constants.Images.myProperty} />
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ) : (
            <View
              style={{
                width: '80%',
                marginBottom: wp('5%'),
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  this.props.navigation.push(
                    Constants.Navigations.Onboarding.WELCOME,
                  );
                }}>
                <Image source={Constants.Images.arrowDetail} />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('3%'),
                    marginLeft: wp('4%'),
                    width: wp('60%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('login')}{' '}
                </Text>
                <Image source={Constants.Images.user} />
              </TouchableOpacity>
            </View>
          )}

          {/* <View
            style={{
              width: '80%',
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%'),
            }}>
            <Image source={Constants.Images.arrowDetail} />
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3%'),
                marginRight: wp('3%'),
                marginLeft: wp('4%'),
                width: wp('60%'),
                textAlign: 'right',
              }}>
              {' '}
              {Common.Translations.translate('payingoff')}{' '}
            </Text>
            <Image source={Constants.Images.payingoff} />
          </View> */}

          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%'),
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                this.props.navigation.push(
                  Constants.Navigations.Setting.SETTING,
                );
              }}>
              <Image source={Constants.Images.arrowDetail} />
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3%'),
                  marginRight: wp('3%'),
                  marginLeft: wp('4%'),
                  width: wp('60%'),
                  textAlign: 'right',
                }}>
                {' '}
                {Common.Translations.translate('settings')}{' '}
              </Text>
              <Image source={Constants.Images.setting} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%'),
            }}>
            <Image source={Constants.Images.arrowDetail} />
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3%'),
                marginRight: wp('3%'),
                marginLeft: wp('4%'),
                width: wp('60%'),
                textAlign: 'right',
              }}>
              {' '}
              {Common.Translations.translate('rateApp')}{' '}
            </Text>
            <Image source={Constants.Images.rateApp} />
          </View>

          <View
            style={{
              width: '80%',
              marginTop: wp('10%'),
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%'),
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                this.props.navigation.push(Constants.Navigations.Setting.HELP);
              }}>
              <Image source={Constants.Images.arrowDetail} />
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3%'),
                  marginRight: wp('3%'),
                  marginLeft: wp('4%'),
                  width: wp('60%'),
                  textAlign: 'right',
                }}>
                {' '}
                {Common.Translations.translate('help')}{' '}
              </Text>
              <Image source={Constants.Images.help} style={{ height: 16, width: 16, resizeMode: "contain" }} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%'),
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                this.setState({ isDisplayContact: !this.state.isDisplayContact })
              }}>
              <Image source={Constants.Images.arrowDetail} />
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3%'),
                  marginRight: wp('3%'),
                  marginLeft: wp('4%'),
                  width: wp('60%'),
                  textAlign: 'right',
                }}>
                {' '}
                {Common.Translations.translate('contactUs')}{' '}
              </Text>
              <Image source={Constants.Images.contact_us} style={{ height: 20, width: 20, resizeMode: "contain" }} />
            </TouchableOpacity>
          </View>
          {
            this.state.isDisplayContact &&
            <View>
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    let phoneNumber = '';

                    if (Platform.OS === 'android') {
                      phoneNumber = 'tel:${00972 599 -552-438}';
                    }
                    else {
                      phoneNumber = 'telprompt:${00972 599 -552-438}';
                    }

                    Linking.openURL(phoneNumber);
                  }}>
                  <Image source={Constants.Images.arrowDetail} />
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('3%'),
                      marginLeft: wp('4%'),
                      width: wp('60%'),
                      textAlign: 'right',
                    }}>
                    {' '}
                    {Common.Translations.translate('contactByPhone')}{' '}
                  </Text>
                  <Image source={Constants.Images.contactByPhone} style={{ height: 16, width: 16, resizeMode: "contain" }} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '80%',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%')
                }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    Linking.openURL('mailto:info@aeliasoft.com').then(
                      function (value) { /* code if successful */ },
                      function (error) { console.log(error) }
                    );
                  }}>
                  <Image source={Constants.Images.arrowDetail} />
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('3%'),
                      marginLeft: wp('4%'),
                      width: wp('60%'),
                      textAlign: 'right',
                    }}>
                    {' '}
                    {Common.Translations.translate('contactByEmail')}{' '}
                  </Text>
                  <Image source={Constants.Images.contactByEmail} style={{ height: 16, width: 16, resizeMode: "contain" }} />
                </TouchableOpacity>
              </View>
            </View>
          }


          <TouchableOpacity
            style={{
              width: '80%',
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              paddingVertical: wp('2%')
            }} onPress={() => {
              Share.open(options)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            }}>
            <Image source={Constants.Images.arrowDetail} />
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3%'),
                marginRight: wp('3%'),
                marginLeft: wp('4%'),
                width: wp('60%'),
                textAlign: 'right',
              }}>
              {' '}
              {Common.Translations.translate('share')}{' '}
            </Text>
            <Image source={Constants.Images.share} />
          </TouchableOpacity>
          {Constants.API.Token != null && (
            <View
              style={{
                width: '80%',
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: wp('2%'),
              }}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  Common.KeyChain.remove('authToken');
                  Constants.API.Token = null;
                  // this.props.navigation.push(
                  //   Constants.Navigations.Onboarding.WELCOME,
                  // );

                  this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        { name: Constants.Navigations.Onboarding.DASHBOARD },
                      ],
                    }),
                  );
                }}>
                <Image source={Constants.Images.arrowDetail} />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('3%'),
                    marginLeft: wp('4%'),
                    width: wp('60%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('signOut')}{' '}
                </Text>
                <Image source={Constants.Images.logout} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(More);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
