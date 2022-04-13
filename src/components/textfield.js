import React from 'react';
import {TextInput, StyleSheet, View, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Translations} from '../common/index';
import * as Constants from '../constants/index';

const AmlakField = (props) => (
  <View style={[styles.container, props.containerStyle]}>
    <TextInput
      {...props}
      style={[styles.textAreaContainer, props.fieldStyle]}
      onChangeText={props.onChangeText}
      placeholder={
        props.placeholder == null
          ? ''
          : `${Translations.translate(props.placeholder)}`
      }
      value={props.value}
    />
    {props.error != undefined ? (
      <Image
        style={{position: 'absolute', left: wp('3%')}}
        source={Constants.Images.warning}
      />
    ) : null}
  </View>
);
export default AmlakField;

const styles = StyleSheet.create({
  container: {
    width: wp('80%'),
    height: hp('5%'),
    borderRadius: hp('5%') / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(211,211,211)',
  },
  textAreaContainer: {
    width: wp('75%'),
    height: hp('4%'),
    textAlign: 'right',
    fontFamily: Constants.Fonts.shamel,
    fontSize: wp('3.2%'),
    paddingVertical: 0,
  },
  title: {
    fontSize: 12,
    fontFamily: Constants.Fonts.shamel,
    textAlign: 'center',
  },
});
