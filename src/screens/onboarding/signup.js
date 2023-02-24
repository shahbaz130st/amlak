import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';

import * as Constants from '../../constants/index';
import * as Services from '../../services/index';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Common from '../../common/index';

class Signup extends Component {
  state = {
    phone: '',
    code: '+970',
    passwordShow: false,
    accept: false,
    name: '',
    idNumber: '',
    imageURI: null,
    errorFieldName: '',
  };

  componentDidMount() {
    Common.Helper.logEvent('signup', {})
  }

  presentImagePicker = () => {
    const options = {
      title: `${Common.Translations.translate('selectProfilePic')}`,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        ImageResizer.createResizedImage(response.uri, 700, 700, 'JPEG', 30, 0)
          .then((response) => {
            const source = { uri: response.uri };
            this.setState({
              imageURI: source,
            });
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
          })
          .catch((err) => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
          });
      }
    });
  };

  createFormData = (photo, body) => {
    const data = new FormData();
    if (photo) {
      let filePath =
        Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '');
      data.append('profile_pic', {
        name:
          photo.fileName == undefined
            ? `${Math.random().toString(36).substring(7)}.jpg`
            : photo.fileName,
        type: photo.type == undefined ? 'image/jpg' : photo.type,
        uri: filePath,
      });
    } else {
      data.append('profile_pic', '');
    }

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  submitAction = async () => {
    if (this.state.name == '') {
      this.setState({ errorFieldName: 'name' });
      Common.Alert.show('alert', Common.Translations.translate('enterName'));
    } else if (this.state.phone == '') {
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
    } else if (this.state.accept == false) {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('acceptTermsConditions'),
      );
    }

    else {
      this.setState({ errorFieldName: '' });
      this.props.toggleLoader(true);
      let params = {};
      params.national_id = this.state.idNumber;
      params.name = this.state.name;
      params.mobile = this.state.phone;
      params.country_code = this.state.code.replace(this.state.phone, '');
      params.buyer_or_seller = 'seller';
      let formParams = this.createFormData(this.state.imageURI, params);
      let userData = await Services.AuthServices.userSignup(formParams);
      this.props.toggleLoader(false);
      if (userData) {
        this.props.navigation.push(
          Constants.Navigations.Onboarding.VERIFICATION,
          { data: userData },
        );
      }
    }

    // this.props.navigation.push(
    //   Constants.Navigations.Onboarding.VERIFICATION,
    // );
  };
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'right',
            marginBottom: hp('4%'),
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp('5.3%'),
            width: '85%',
          }}>
          {Common.Translations.translate('registerWithAmlak')}
        </Text>
        <View style={{ width: '100%' }}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            contentContainerStyle={styles.mainContainer}
            keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.presentImagePicker();
                  }}>
                  <Image
                    style={{
                      width: wp('30%'),
                      height: wp('30%'),
                      borderRadius: wp('30%') / 2,
                    }}
                    source={
                      this.state.imageURI == null
                        ? Constants.Images.profile
                        : this.state.imageURI
                    }
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    width: wp('75%'),
                    marginBottom: hp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.2%'),
                  }}>
                  {Common.Translations.translate('name')}
                </Text>
                <Components.AmlakField
                  containerStyle={{
                    borderColor:
                      this.state.errorFieldName == 'name'
                        ? 'red'
                        : 'rgb(211,211,211)',
                  }}
                  onChangeText={(text) => this.setState({ name: text })}
                  value={this.state.name}
                  maxLength={20}
                  error={this.state.errorFieldName == 'name' ? true : undefined}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    width: wp('75%'),
                    marginBottom: hp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.2%'),
                  }}>
                  {Common.Translations.translate('enterMobileNumber')}
                </Text>
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
                  {/* <Image source={Constants.Images.country_logo} style={{ position: 'absolute', width: wp('8%'), resizeMode: 'contain', left: wp('2%') }} /> */}

                </View>
              </View>

              {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    width: wp('75%'),
                    marginBottom: hp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.2%'),
                  }}>
                  {Common.Translations.translate('idNumber')}
                </Text>
                <Components.AmlakField
                  error={
                    this.state.errorFieldName == 'enterIDNumber' ? true : null
                  }
                  containerStyle={{
                    borderColor:
                      this.state.errorFieldName == 'enterIDNumber'
                        ? 'red'
                        : 'rgb(211,211,211)',
                  }}
                  placeholder="idNumberPlaceholder"
                  keyboardType="number-pad"
                  onChangeText={(text) => this.setState({ idNumber: text })}
                  value={this.state.idNumber}
                />
              </View> */}

              <View
                style={{
                  // justifyContent: 'center',
                  width: wp('75%'),
                  // alignItems: 'center',
                  marginTop: hp('3%'),
                  flexDirection: 'row-reverse',
                  // borderColor:"red",
                  // borderWidth:1
                }}>
                <TouchableOpacity
                  style={{ marginLeft: wp('2%'), marginTop: wp('0.1%') }}
                  onPress={() => {
                    this.setState({ accept: !this.state.accept });
                  }}>
                  <Image
                    style={{ width: wp('4%'), height: wp('4%') }}
                    source={
                      this.state.accept
                        ? Constants.Images.check
                        : Constants.Images.uncheck
                    }
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                  }}>
                  {Common.Translations.translate('agree')}
                </Text>

                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                    textDecorationLine: 'underline',
                    color: Constants.Colors.buttonBackground,
                  }}
                  onPress={() => { Linking.openURL("http://amlakbuyandsell.com/termsandconditions") }}>
                  {Common.Translations.translate('termsOfuser')}
                </Text>
                {/* <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                  }}>
                  {Common.Translations.translate('and')}
                </Text> */}

                {/* <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                    textDecorationLine: 'underline',
                    color: Constants.Colors.buttonBackground,
                  }}
                  onPress={() => { }}>
                  {Common.Translations.translate('advertisingFees')}
                </Text> */}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <Components.AmlakButton
                  title="signup"
                  titleStyles={{ color: Constants.Colors.white, fontFamily: Constants.Fonts.shamelBold }}
                  containerStyles={{
                    backgroundColor: Constants.Colors.buttonBackground,
                  }}
                  onClick={() => {
                    this.submitAction();
                  }}
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                  flexDirection: 'row-reverse',
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('haveAccount')}
                </Text>

                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3%'),
                    color: Constants.Colors.buttonBackground,
                    marginRight: wp('4%'),
                  }}
                  onPress={() => {
                    this.props.navigation.push(
                      Constants.Navigations.Onboarding.LOGIN,
                    );
                  }}>
                  {Common.Translations.translate('loginhere')}
                </Text>
              </View>
              <Text
                style={{
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3%'),
                  color: Constants.Colors.buttonBackground,
                  marginRight: wp('4%'),
                }}
                onPress={() => {
                  this.props.navigation.push(
                    Constants.Navigations.Onboarding.DASHBOARD,
                  );
                }}>
                {Common.Translations.translate('listingPage')}
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Signup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainContainer: {
    // flexGrow: 1,
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
    paddingHorizontal: 0,
  },
  textAreaContainer: {
    width: wp('50%'),
    height: hp('4%'),
    borderWidth: 1,
  },
});
