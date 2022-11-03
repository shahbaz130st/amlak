import React, { Component } from 'react';

import { StyleSheet, View, Text, Keyboard, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import PhoneInput from 'react-native-phone-number-input';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Components from '../../components/index';
import * as Services from '../../services/index';
import { Actions } from '../../redux/index';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Login extends Component {
  state = {
    phone: '',
    code: '+970',
    errorFieldName: '',
  };
  componentDidMount() {
    Common.Helper.logEvent('login', {})
  }

  submitAction = async () => {
    Keyboard.dismiss();
    if (this.state.phone == '') {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('errorEnterMobileNumber'),
      );
      this.setState({ errorFieldName: 'mobileNumberError' });
    } else if (this.state.phone.length != 10 && this.state.phone.length != 9) {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('errorMobileNumberLength'),
      );
      this.setState({ errorFieldName: 'mobileNumberError' });
    } else {
      this.setState({ errorFieldName: '' });
      this.props.toggleLoader(true);
      console.log('code---->', this.state.code);
      let login = await Services.AuthServices.userLogin({
        mobile: this.state.phone,
        country_code: this.state.code.replace(this.state.phone, '')
      });
      this.props.toggleLoader(false);
      // console.log('code---->', login);
      setTimeout(() => {
        if (login) {
          // if (login?.is_disabled == 1) {
          //   this.showDisableAlert(login.id)
          // } else {
            if (login.id) {
              this.props.navigation.push(
                Constants.Navigations.Onboarding.VERIFICATION,
                { data: login },
              );
              console.log('login----->', login);
            } else {
              console.log('error----->', login);
            }
          }

        // }
      }, 1000);
      // this.props.navigation.push(Constants.Navigations.Onboarding.LOGIN)
    }
  };

  showDisableAlert = (id) => {
    Alert.alert(
      "",
      Common.Translations.translate('diactivate_Account'),
      [
        {
          text: Common.Translations.translate('no'),
          onPress: () => {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: Constants.Navigations.Onboarding.DASHBOARD, }]
            });
            this.props.navigation.navigate(
              Constants.Navigations.Onboarding.DASHBOARD,
            );
          },
          style: "cancel"
        },
        {
          text: Common.Translations.translate('confirm'), onPress: () => { 
            this.props.navigation.push(Constants.Navigations.Onboarding.SIGNUP)
          }
          // async () => {
          //   let enableUser = await Services.AuthServices.enableUser({
          //     id: id,
          //   });
          //   if (enableUser?.status) {
          //     this.submitAction()
          //   }
          // }
        }
      ]
    );
  }

  showError = (title, message) =>
    Alert.alert(
      Common.Translations.translate(title),
      message,
      [
        {
          text: Common.Translations.translate('ok'),
          onPress: () =>
            this.props.navigation.push(Constants.Navigations.Onboarding.SIGNUP),
        },
      ],
      { cancelable: false },
    );

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: hp('10%'),
            marginBottom: hp('1%'),
          }}>
          <Text
            style={{
              textAlign: 'right',
              marginBottom: hp('2%'),
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('5.3%'),
              width: '90%',
            }}>
            {Common.Translations.translate('loginWithAmlak')}
          </Text>
          <Text
            style={{
              textAlign: 'right',
              paddingRight: wp('10%'),
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp('3.2%'),
            }}>
            {Common.Translations.translate('enterMobileNumber')}
          </Text>
        </View>
        <View
          style={[
            styles.textContainer,
            {
              borderColor:
                this.state.errorFieldName == 'mobileNumberError'
                  ? 'rgb(255,0,0)'
                  : 'rgb(211,211,211)',
            },
          ]}>
          <PhoneInput
            ref={(ref) => {
              this.phoneInput = ref;
            }}
            defaultCode="PS"
            defaultValue={this.state.phone}
            onChangeText={(text) => {
              this.setState({ phone: text });
            }}
            onChangeFormattedText={(text) => {
              this.setState({ code: text });
            }}
            textInputStyle={styles.textAreaContainer}
            codeTextStyle={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('3.2%'),
              height: hp('2.5%'),
            }}
            flagButtonStyle={{
              justifyContent: 'center',
              width: wp('12%'),
              height: "100%",
              marginLeft: wp('3%')
            }}
            textInputProps={{
              maxLength: 10,
              placeholder: ' 59 XXXXXXX',
              keyboardType: 'number-pad',
              style: {
                paddingVertical: 0,
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3.2%'),
                height: hp('5%'),
                width: wp('50%'),
                paddingLeft: wp('2.5%'),
                borderStartWidth: 0.7,
                borderStartColor: '#E1E1E1',
                borderRadius: hp('5%') / 2,
                justifyContent: "center"
              },
            }}
            // disableArrowIcon={true}
            getCallingCode={(text) => {
              this.setState({ code: text });
            }}
            containerStyle={{
              width: wp('80%'),
              height: hp('5%'),
              borderRadius: hp('5%') / 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgb(211,211,211)',
            }}
            textContainerStyle={{
              backgroundColor: "white",
              width: wp('79%'),
              height: hp('4.8%'),
              borderRadius: hp('5%') / 2,
            }}
          />
          {this.state.errorFieldName == 'mobileNumberError' && (
            <Image
              style={{ position: 'absolute', right: wp('3%') }}
              source={Constants.Images.warning}
            />
          )}
          {/* <Image source = {Constants.Images.country_logo} style = {{position:'absolute',width:wp('8%'),resizeMode:'contain',left:wp('2%')}}/> */}
        </View>
        <View style={{ justifyContent: 'center', marginTop: hp('4%') }}>
          <Components.AmlakButton
            title="login"
            titleStyles={{ color: Constants.Colors.white, fontFamily: Constants.Fonts.shamelBold }}
            containerStyles={{
              backgroundColor: Constants.Colors.buttonBackground,
            }}
            onClick={() => {
              this.submitAction()
            }
            }
          />
        </View>
      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textContainer: {
    width: wp('80%'),
    height: hp('5%'),
    borderRadius: hp('5%') / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(211,211,211)',
    flexDirection: 'row',
  },
  textAreaContainer: {
    width: wp('50%'),
    height: hp('5%'),
  },

  title: {
    fontFamily: Constants.Fonts.shamelBold,
    fontSize: 14,
    color: 'white',
  },
});
