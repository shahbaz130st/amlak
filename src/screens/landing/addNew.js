import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';

class AddNew extends Component {
  state = { accept: false, showAlert: false };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      //do your api call
      this.setState({ accept: false })
        // Constants.API.Token == null ? this.loginAlert() : null
    });
    Common.Helper.logEvent('addProperty', {});
  }
  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe();
  }

  loginAlert = () => {
    this.setState({ showAlert: true })
  }



  // Alert.alert('', Common.Translations.translate('login_required'), [
  //   {
  //     text: Common.Translations.translate('login'),
  // //     onPress: () => {
  //       setTimeout(() => {
  //         this.props.navigation.push(
  //           Constants.Navigations.Onboarding.LOGIN,
  //         );
  //       }, 1000);
  //     },
  //     style: 'cancel',
  //   },
  // ]);

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <Components.AmlakHeader
          height={hp('11%')}
          title={Common.Translations.translate('postAdvertisement')}
        />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          contentContainerStyle={styles.mainContainer}
          keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'column', width: '95%', height: '100%' }}>
            <Text
              style={{
                marginTop: wp('8%'),
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamel,
                color: '#444040',
                fontSize: wp('3.5%'),
              }}>
              {Common.Translations.translate('property_accept')}
            </Text>
          </View>
        </KeyboardAwareScrollView>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: 'flex-end',
            marginTop: wp('3%'),
            marginBottom: wp('2%'),
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'right',
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp('4%'),
            }}>
            {Common.Translations.translate('agree_fees')}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: wp('2%'), marginTop: wp('0.1%') }}
            onPress={() => {
              this.setState({ accept: !this.state.accept });
            }}>
            <Image
              style={{ width: wp('4%'), height: wp('4%'), marginRight: wp('2%') }}
              source={
                this.state.accept
                  ? Constants.Images.filterCheck
                  : Constants.Images.filterUncheck
              }
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: hp('1%'),
            marginBottom: wp('2%'),
          }}>
          <Components.AmlakButton
            title={'next'}
            titleStyles={{ color: Constants.Colors.white }}
            containerStyles={{
              backgroundColor: this.state.accept
                ? Constants.Colors.buttonBackground
                : 'rgba(0,111,235,0.5)',
            }}
            onClick={() => {

              if (this.state.accept) {
                if (Constants.API.Token == null) {
                  this.loginAlert()
                  return true
                }
                else {
                  this.props.navigation.push(
                    Constants.Navigations.Property.Category,
                  )
                }
              } else {
                null;
              }
            }}
          />
        </View>
        {this.state.showAlert &&
          <Modal
            transparent={true}
            visible={this.state.showAlert}
          >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#00000030" }}>
              <View style={{ width: '80%', height: 150, backgroundColor: "white", borderRadius: 20, justifyContent: "space-between", paddingTop: 20 }}>
                <Text style={{ fontSize: 20, textAlign: "center", paddingHorizontal: 20 }}>{Common.Translations.translate('login_required')}</Text>
                <View style={{
                  height: 50,
                  width: "100%",
                  borderTopWidth: 1,
                  borderTopColor: "lightgrey",
                  flexDirection: "row"
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showAlert: false })
                      setTimeout(() => {
                        this.props.navigation.push(
                          Constants.Navigations.Onboarding.LOGIN,
                        );
                      }, 1000);
                    }}
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 1,
                      borderColor: "lightgrey"
                    }}>
                    <Text style={{ fontSize: 20, color: "#6495ED" }}>{Common.Translations.translate('login')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showAlert: false })
                      // setTimeout(() => {

                      //   this.props.navigation.push(
                      //     Constants.Navigations.Onboarding.DASHBOARD,
                      //   );
                      // }, 1000);

                    }}
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                    <Text style={{ fontSize: 20, color: "#6495ED" }}>{Common.Translations.translate('ok')}</Text>
                  </TouchableOpacity>
                </View>

              </View>

            </View>

          </Modal>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddNew;
