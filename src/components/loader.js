import React from 'react';
import * as Constants from '../constants/index';
import Spinner from 'react-native-spinkit';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default (props) => {
  return (
    <Spinner
      style={props.style}
      isVisible={props.isVisible}
      size={props.size || wp('10%')}
      type={'WanderingCubes'}
      color={props.color || Constants.Colors.buttonBackground}
    />
  )
}
