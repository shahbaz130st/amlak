import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import * as Constants from '../constants/index';

const AmlakHeader = (props) => (
  <View style={[styles.container, { height: props.height }]}>
    <Text style={styles.title}>{props.title}</Text>
    {props.isButtons == undefined ? null : (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          width: '100%',
          height: hp('4%'),
          backgroundColor: 'transparent',
          justifyContent: 'space-between'
        }}>
        {props.leftButton != undefined ? (
          <TouchableOpacity
            style={{ right: 5, paddingTop: '2%', paddingHorizontal: 30, }}
            onPress={props.onSettingClick}>
            <Image source={props.leftButton} />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={{ right: 5, paddingTop: '2%', paddingHorizontal: 30 }}
          onPress={props.onBackButtonClick}>
          <Image source={Constants.Images.rightArrow} />
        </TouchableOpacity>
      </View>
    )}
  </View>
);
export default AmlakHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 0.5,
    paddingBottom: 5
  },
  title: {
    fontSize: wp('3.5%'),
    fontFamily: Constants.Fonts.shamelBold,
    textAlign: 'center',
  },
});
