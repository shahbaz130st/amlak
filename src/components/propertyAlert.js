import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
} from 'react-native';
import * as AppConstant from '../constants/index';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import * as Common from '../common/index';

const opacity = 0.5;

const AmlakPropertyAlert = (props) => {

    return (
        <SafeAreaView
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: '100%',
                height: '100%',
                zIndex: 10,
                position: 'absolute',
            }}
            onStartShouldSetResponder={props.onCross}>
            <View style={[styles.container, props.containerStyle]}>
                <Animatable.View
                    animation={'fadeIn'}
                    style={[styles.headerView, { paddingBottom: 2 }]}>
                    {props.showBottomPicker && (
                        <View
                            style={{
                                width: '100%',
                                // height: hp('2%'),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>

                            <View
                                style={{
                                    width: wp('20%'),
                                    height: wp('1.2%'),
                                    backgroundColor: '#E0E0E0',
                                    marginTop: 5
                                }}
                            />
                        </View>
                    )}

                </Animatable.View>
                <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: wp('6%'), marginBottom: wp('1%') }}>
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: wp('4%'), marginTop: wp('1%') }} onPress={() => {
                                    props.onSelectOption('repost')
                        }
                        }>
                            <Text style={{ fontFamily: AppConstant.Fonts.shamelBold, fontSize: wp('4%'), marginRight: wp('8%') }}>{Common.Translations.translate('report_your_ad')}</Text>
                            <Image source={AppConstant.Images.repeat} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: wp('4%'), marginTop: wp('5%') }} onPress={() => {
                                    props.onSelectOption('delete')
                        }
                        }>
                            <Text style={{ fontFamily: AppConstant.Fonts.shamelBold, fontSize: wp('4%'), marginRight: wp('8%'), color: '#FF3B30' }}>{Common.Translations.translate('delete_adver')}</Text>
                            <Image source={AppConstant.Images.delete} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '90%', marginTop: wp('3%'), backgroundColor: '#F0F0F0', borderRadius: wp('3%'), marginTop: wp('6%') }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: wp('3%') }} onPress={props.onCross}>
                            <Text style={{ fontFamily: AppConstant.Fonts.shamelBold, fontSize: wp('4%'), marginRight: wp('8%') }}>{Common.Translations.translate('cancellation')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

AmlakPropertyAlert.propTypes = {
    title: PropTypes.string,
    listData: PropTypes.arrayOf(PropTypes.any),
    onSelectOption: PropTypes.func,
    closePicker: PropTypes.func,
};

AmlakPropertyAlert.defaultProps = {
    title: '',
    listData: [],
    onSelectOption: () => { },
    closePicker: () => { },
};

export default AmlakPropertyAlert;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: AppConstant.Colors.buttonBackground,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'center',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowColor: '#000000',
        elevation: 4,
        borderTopLeftRadius: wp('3%'),
        borderTopRightRadius: wp('3%')
    },

    headerView: {
        marginBottom: wp('4%'),
    },

});
