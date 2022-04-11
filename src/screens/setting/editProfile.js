import React, {Component} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {connect} from 'react-redux';
import {Actions} from '../../redux/index';

import * as Constants from '../../constants/index';
import * as Services from '../../services/index';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Common from '../../common/index';
import User from '../../models/user';

class EditProfile extends Component {
  state = {
    phone: '',
    code: '',
    name: '',
    idNumber: '',
    imageURI: null,
    errorFieldName: '',
    email:''
  };
  async componentDidMount() {
    let userInstance = User.getInstance();
    if (userInstance.getUser().info) {
console.log(userInstance.getUser().info);   
this.setState({phone:userInstance.getUser().info.mobile});
this.setState({code:userInstance.getUser().info.country_code});
this.setState({name:userInstance.getUser().info.name});
this.setState({idNumber:userInstance.getUser().info.national_id});
this.setState({email:userInstance.getUser().info.email});
this.setState({imageURI :{ uri: userInstance.getUser().info.profile_pic }});

    }
    Common.Helper.logEvent('profile', {
    });
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
            const source = {uri: response.uri};
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

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  submitAction = async () => {
    if (this.state.name == '') {
      this.setState({errorFieldName: 'name'});
      Common.Alert.show('alert', Common.Translations.translate('enterName'));
    } else if (this.state.phone == '') {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('errorEnterMobileNumber'),
      );
      this.setState({errorFieldName: 'mobileNumberError'});
    } else if (this.state.phone.length != 10 && this.state.phone.length != 9) {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('errorMobileNumberLength'),
      );
      this.setState({errorFieldName: 'mobileNumberError'});
    } else if (this.state.idNumber == '') {
      this.setState({errorFieldName: 'enterIDNumber'});
      Common.Alert.show(
        'alert',
        Common.Translations.translate('enterIDNumber'),
      );
    }  else if (this.state.imageURI == null) {
      Common.Alert.show(
        'alert',
        Common.Translations.translate('selectProfilePic'),
      );
    } else {
      this.setState({errorFieldName: ''});
      this.props.toggleLoader(true);
      let params = {};
      params.national_id = this.state.idNumber;
      params.name = this.state.name;
      params.mobile = this.state.phone;
      params.country_code = this.state.code;
      let formParams = this.createFormData(this.state.imageURI, params);
      let userData = await Services.AuthServices.updateProfile(formParams);
      this.props.toggleLoader(false);
      if (userData) {
        console.log('signup------>', userData);
       this.props.navigation.goBack();
      }
    }

    // this.props.navigation.push(
    //   Constants.Navigations.Onboarding.VERIFICATION,
    // );
  };
  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          leftButton={Constants.Images.setting}
          title={Common.Translations.translate('my_account')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        
        />
        <View style={{width: '100%'}}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            contentContainerStyle={styles.mainContainer}
            keyboardShouldPersistTaps="handled">
            <View style={{alignItems: 'center', flexDirection: 'column'}}>
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
                        borderRadius:0,
                        borderWidth:1
                  }}
                  onChangeText={(text) => this.setState({name: text})}
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
                  {Common.Translations.translate('email')}
                </Text>
                <Components.AmlakField
                  containerStyle={{
                    borderColor:
                      this.state.errorFieldName == 'email'
                        ? 'red'
                        : 'rgb(211,211,211)',
                        borderRadius:0,
                        borderWidth:1
                  }}
                  onChangeText={(text) => this.setState({email: text})}
                  value={this.state.email}
                  maxLength={20}
                  error={this.state.errorFieldName == 'email' ? true : undefined}
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
                          borderRadius:0,
                        borderWidth:1
                    },
                  ]}>
                  <PhoneInput
                    ref={(ref) => {
                      this.phoneInput = ref;
                    }}
                    disabled ={true}
                    defaultCode={this.state.code}
                    defaultValue={this.state.phone}
                    onChangeText={(text) => {
                      this.setState({phone: text});
                    }}
                    onChangeFormattedText={(text) => {
                      this.setState({code: text});
                    }}
                    containerStyle={{
                      backgroundColor: 'transparent',
                      width: wp('80%'),
                      height: hp('5%'),
                    }}
                    textContainerStyle={{
                      backgroundColor: 'transparent',
                      paddingHorizontal: 0,
                      paddingVertical: 0,
                      alignItems: 'center',
                    }}
                    textInputStyle={styles.textAreaContainer}
                    codeTextStyle={{
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.2%'),
                      marginLeft: wp('1%'),
                    }}
                    flagButtonStyle={{
                      justifyContent: 'center',
                      width: wp('9%'),
                      marginLeft: wp('3%'),
                    }}
                    textInputProps={{
                      maxLength: 10,
                      placeholder: ' 59 XXXXXXX',
                      keyboardType: 'number-pad',
                      style: {
                        paddingVertical: 0,
                        fontFamily: Constants.Fonts.shamel,
                        fontSize: wp('3.2%'),
                        height: hp('3%'),
                        width: wp('50%'),
                        paddingLeft: wp('2.5%'),
                        borderStartWidth: 0.7,
                        borderStartColor: '#E1E1E1',
                      },
                    }}
                    disableArrowIcon={true}
                    getCallingCode={(text) => {
                      this.setState({code: text});
                    }}
                  />
                  {this.state.errorFieldName == 'mobileNumberError' && (
                    <Image
                      style={{position: 'absolute', right: wp('3%')}}
                      source={Constants.Images.warning}
                    />
                  )}
                </View>
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
                        borderRadius:0,
                        borderWidth:1
                  }}
                  placeholder="idNumberPlaceholder"
                  keyboardType="number-pad"
                  onChangeText={(text) => this.setState({idNumber: text})}
                  value={this.state.idNumber}
                />
              </View>

            
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                }}>
                <Components.AmlakButton
                  title="save_changes"
                  titleStyles={{color: Constants.Colors.white,fontFamily: Constants.Fonts.shamelBold}}
                  containerStyles={{
                    backgroundColor: Constants.Colors.buttonBackground,
                  }}
                  onClick={() => {
                    this.submitAction();
                  }}
                />
              </View>
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

export default connect(null, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
