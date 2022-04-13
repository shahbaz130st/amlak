import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity, Text

} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { Translations } from '../common/index';
import * as Constants from '../constants/index';

const AmlakButton = props => (
    <TouchableOpacity onPress={props.onClick}>
        <View style={[styles.container, props.containerStyles]}>
            <Text style={[styles.title], [props.titleStyles]}> {Translations.translate(props.title)}</Text>
        </View>
    </TouchableOpacity>

)
export default AmlakButton;

const styles = StyleSheet.create({
    container: {
        width: wp('80%'),
        height: hp('5%'),
        borderRadius: hp('5%') / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        fontFamily: Constants.Fonts.shamel,
        textAlign: 'center'
    }

});