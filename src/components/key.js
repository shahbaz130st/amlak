import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity, Text,
    Image

} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { Translations } from '../common/index';
import * as Constants from '../constants/index';

const AmlakKey = props => (
    <TouchableOpacity   onPress={() => props.onClick(props.title)}>
        <View style={[styles.container, props.containerStyles]}>
        {
            typeof(props.title) === 'string' ?  <Text style={[styles.title, props.titleStyles]}>{props.title}</Text> : <Image style = {{width:wp('6%'),height:hp('2%')}} source = {props.image}/>
        }
        </View>
    </TouchableOpacity>

)
export default AmlakKey;

const styles = StyleSheet.create({
    container: {
        width: wp('20%'),
        height: hp('5%'),
        borderRadius: hp('5%') / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: hp('2%'),
        textAlign: 'center'
    }

});