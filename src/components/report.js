import React, { useState } from 'react';
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
import AmlakButton from './button'
import * as Constants from '../constants/index';

const opacity = 0.5;
let selectItem = null;

const AmlakReport = (props) => {
    const [listArray, setListArray] = useState(props.listData)
    const [selected, setSelectedItem] = useState({});

    let id =
        props.item == null
            ? null
            : props.item.id == undefined
                ? props.item
                : props.item.id;
                console.log('lll---->',AppConstant.API.Language);
    return (
        <SafeAreaView
            style={{
                backgroundColor: props.showBottomPicker
                    ? 'rgba(0,0,0,0.5)'
                    : 'transparent',
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
                            }}>
                            <TouchableOpacity
                                onPress={props.onCross}
                                style={{ marginLeft: wp('4%'), marginTop: wp('5%') }}>
                                <Image source={AppConstant.Images.closeBig} />
                            </TouchableOpacity>
                            <View
                                style={{
                                    width: wp('20%'),
                                    height: wp('1.2%'),
                                    backgroundColor: '#E0E0E0',
                                    marginLeft: wp('35%'),
                                    alignSelf: 'flex-start',
                                    marginTop: 5
                                }}
                            />
                        </View>
                    )}
                    <FlatList
                        style={[styles.listStyle]}
                        data={listArray}
                        extraData={props}
                        keyExtractor={(item, index) => `${item.id}`}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={opacity}
                                onPress={() => {
                                    // item.id != '0' ? props.onSelectOption(item) : null
                                    // props.onSelectOption(item)
                                    if (item.id != '-1') {
                                    //     const array = [...listArray]
                                    // array[index].is = !array[index].is
                                    selectItem = item;
                                    setSelectedItem(item);
                                    }

                                }
                                }>
                                <View style={styles.rowStyle}>
                                    {!item.id == '-1' ? (
                                        <Text
                                            style={[
                                                styles.cellTitle,
                                                AppConstant.API.Language == 'ar' ?
                                                    {
                                                        fontFamily: AppConstant.Fonts.shamelBold,
                                                        fontSize: props.showBottomPicker ? wp('4%') : wp('4%'),
                                                        color: 'black',
                                                        textAlign: props.showBottomPicker
                                                            ? 'right' : 'center',
                                                        marginRight: props.showBottomPicker ? wp('10%') : 0,
                                                    } : {
                                                        fontFamily: AppConstant.Fonts.shamelBold,
                                                        fontSize: props.showBottomPicker ? wp('4%') : wp('4%'),
                                                        color: 'black',
                                                        textAlign: props.showBottomPicker
                                                            ? 'left' : 'center',
                                                        marginLeft: props.showBottomPicker ? wp('10%') : 0,
                                                    },
                                            ]}>
                                            {item.name}
                                        </Text>
                                    ) : (
                                            <React.Fragment>
                                            {
                                                item.id == '-1'  ? null :  selected.id == item.id  ?
                                                    //id == item.id ?
                                                    <Image
                                                        style={AppConstant.API.Language == 'ar' ? { position: 'absolute', right: wp('2%') } : { position: 'absolute', left: wp('2%') }}
                                                        source={AppConstant.Images.checksel}
                                                    />
                                                    :
                                                    <Image
                                                        style={AppConstant.API.Language == 'ar' ? { position: 'absolute', right: wp('2%') } : { position: 'absolute', left: wp('2%') }}
                                                        source={AppConstant.Images.unchecksel}
                                                    />
                                                
                                            }
                                               
                                                <Text
                                                    style={[
                                                        styles.cellTitle,
                                                        AppConstant.API.Language == 'ar' ? {
                                                            fontFamily:
                                                                id == null
                                                                    ? AppConstant.Fonts.shamel
                                                                    : id == item.id
                                                                        ? AppConstant.Fonts.shamelBold
                                                                        : AppConstant.Fonts.shamel,

                                                            color:
                                                                id == null
                                                                    ? 'black'
                                                                    : id == item.id
                                                                        ? '#006FEB'
                                                                        : 'black',
                                                            textAlign: props.showBottomPicker
                                                                ? 'right'
                                                                : 'center',
                                                            marginRight: wp('30%'),

                                                        } : {
                                                                fontFamily:
                                                                    id == null
                                                                        ? AppConstant.Fonts.shamel
                                                                        : id == item.id
                                                                            ? AppConstant.Fonts.shamelBold
                                                                            : AppConstant.Fonts.shamel,

                                                                color:
                                                                    id == null
                                                                        ? 'black'
                                                                        : id == item.id
                                                                            ? '#006FEB'
                                                                            : 'black',
                                                                textAlign: props.showBottomPicker
                                                                    ? 'left'
                                                                    : 'center',
                                                                marginLeft: wp('30%'),
                                                            },
                                                    ]}>
                                                    {item.name}
                                                </Text>
                                            </React.Fragment>
                                        )}

                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <AmlakButton
                        title="submit"
                        titleStyles={{ color: Constants.Colors.white, fontFamily: Constants.Fonts.shamelBold }}
                        containerStyles={{
                            backgroundColor: Constants.Colors.buttonBackground,
                            alignSelf: "center"
                        }}
                        onClick={() => props.onSelectOption(selectItem)}
                    />
                </Animatable.View>
            </View>
        </SafeAreaView>
    );
};

AmlakReport.propTypes = {
    title: PropTypes.string,
    listData: PropTypes.arrayOf(PropTypes.any),
    onSelectOption: PropTypes.func,
    closePicker: PropTypes.func,
};

AmlakReport.defaultProps = {
    title: '',
    listData: [],
    onSelectOption: () => { },
    closePicker: () => { },
};

export default AmlakReport;

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        backgroundColor: AppConstant.Colors.white,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'center',
    },
    closeTouchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listStyle: {
        alignSelf: 'stretch',
    },
    rowStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppConstant.Colors.white,
        paddingVertical: 8,
    },
    headerView: {
        backgroundColor: AppConstant.Colors.white,
        marginBottom: wp('4%'),
    },
    cellTitle: {
        textAlign: 'center',
        fontFamily: AppConstant.Fonts.shamel,
        fontSize: wp('3.5%'),
        width: wp('100%'),
    },
});
