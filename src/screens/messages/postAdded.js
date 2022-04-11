import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';

class PostAdded extends Component {
  state = {
  }
  submitAction = () => {

  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ position: 'absolute', width: wp('5%'), height: wp('5%'), justifyContent: 'center', alignItems: 'center', top: wp('8%'), left: wp('3%') }}>
          <Image source={Constants.Images.closeBig} />
        </TouchableOpacity>
        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={Constants.Images.welcomeLogo} />
          <Text style={{ fontFamily: Constants.Fonts.shamelBold, fontSize: wp('7%'), marginTop: wp('2%'),paddingHorizontal:wp('2%') }}>{Common.Translations.translate('add_posted_title')}</Text>
          <Text style={{ fontFamily: Constants.Fonts.shamelBold, fontSize: wp('5%'), width: '70%', marginTop: wp('2%') }}>{Common.Translations.translate('add_posted_message')}</Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('3%'),
            }}>
            <Components.AmlakButton
              title="done"
              titleStyles={{ color: Constants.Colors.white, fontFamily: Constants.Fonts.shamelBold }}
              containerStyles={{
                backgroundColor: Constants.Colors.buttonBackground,
              }}
              onClick={() => {
                this.submitAction();
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default PostAdded;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

});
