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

const opacity = 0.5;

const AmlakDropDown = (props) => {
  let id =
    props.item == null
      ? null
      : props.item.id == undefined
      ? props.item
      : props.item.id;
      console.log('--------->',AppConstant.API.Language);
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
          style={[styles.headerView, {paddingBottom: 2}]}>
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
                style={{marginLeft: wp('4%'), marginTop: wp('5%')}}>
                <Image source={AppConstant.Images.closeBig} />
              </TouchableOpacity>
              <View
                style={{
                  width: wp('20%'),
                  height: wp('1.2%'),
                  backgroundColor: '#E0E0E0',
                  marginLeft: wp('35%'),
                  alignSelf: 'flex-start',
                  marginTop:5
                }}
              />
            </View>
          )}
          <FlatList
            style={[styles.listStyle]}
            data={props.listData}
            extraData={props}
            keyExtractor={(item, index) => `${item.id}`}
            renderItem={({item}) => (
              console.log("responss all check", item ),
              <TouchableOpacity
                activeOpacity={opacity}
                onPress={() =>
                  // item.id != '0' ? props.onSelectOption(item) : null
                  props.onSelectOption(item)
                }>
                <View style={styles.rowStyle}>
                  {item.id == '0'&&  props.showBottomPicker ? (
                    <Text
                      style={[
                        styles.cellTitle,
                        {
                          fontFamily: AppConstant.Fonts.shamelBold,
                          fontSize: props.showBottomPicker ?  wp('6%'):wp('4%'),
                          color: 'black',
                          textAlign: props.showBottomPicker
                            ? AppConstant.API.Language == 'ar' ? 'right':'left'
                            : 'center',
                          paddingRight: props.showBottomPicker ? wp('10%') : 0,
                          paddingLeft: AppConstant.API.Language == 'ar' ? 0:wp('6%')

                        },
                      ]}>
                      {item.name}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.cellTitle,
                        {
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
                            ? AppConstant.API.Language == 'ar' ? 'right':'left'
                            : 'center',
                          paddingRight: props.showBottomPicker ? wp('10%') : 0,
                          paddingLeft: AppConstant.API.Language == 'ar' ? 0:wp('6%')
                        },
                      ]}>
                      {item.name}
                    </Text>
                  )}

                  {/* {id == item.id && (
                    <Image
                      style={{position: 'absolute', left: wp('2%')}}
                      source={AppConstant.Images.checkSelected}
                    />
                  )} */}
                </View>
              </TouchableOpacity>
            )}
          />
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

AmlakDropDown.propTypes = {
  title: PropTypes.string,
  listData: PropTypes.arrayOf(PropTypes.any),
  onSelectOption: PropTypes.func,
  closePicker: PropTypes.func,
};

AmlakDropDown.defaultProps = {
  title: '',
  listData: [],
  onSelectOption: () => {},
  closePicker: () => {},
};

export default AmlakDropDown;

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
    width: '90%',
  },
});
