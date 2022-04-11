import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';

class AddNew extends Component {
  state = {accept: false};

  componentDidMount() {
    this.props.navigation.addListener(
      'focus',
      () => this.setState({accept: false}),
      Constants.API.Token == null ?  this.loginAlert() : null,
    );
    Common.Helper.logEvent('addProperty', {});
  }
  loginAlert = () =>
    Alert.alert('', Common.Translations.translate('login_required'), [
      {
        text: Common.Translations.translate('login'),
        onPress: () => {
          setTimeout(() => {
            this.props.navigation.push(
              Constants.Navigations.Onboarding.LOGIN,
            );
          }, 1000);
        },
        style: 'cancel',
      },
    ]);

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
        <Components.AmlakHeader
          height={hp('11%')}
          title={Common.Translations.translate('postAdvertisement')}
        />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          contentContainerStyle={styles.mainContainer}
          keyboardShouldPersistTaps="handled">
          <View style={{flexDirection: 'column', width: '95%', height: '100%'}}>
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
            style={{marginLeft: wp('2%'), marginTop: wp('0.1%')}}
            onPress={() => {
              this.setState({accept: !this.state.accept});
            }}>
            <Image
              style={{width: wp('4%'), height: wp('4%'), marginRight: wp('2%')}}
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
            titleStyles={{color: Constants.Colors.white}}
            containerStyles={{
              backgroundColor: this.state.accept
                ? Constants.Colors.buttonBackground
                : 'rgba(0,111,235,0.5)',
            }}
            onClick={() => {
              this.state.accept
                ? this.props.navigation.push(
                    Constants.Navigations.Property.Category,
                  )
                : null;
            }}
          />
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
  },
});

export default AddNew;
