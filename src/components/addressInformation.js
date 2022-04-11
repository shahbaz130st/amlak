import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import * as AppConstant from '../constants/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Common from '../common/index';
import AmlakButton from './button';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import * as Constants from '../constants/index';
import * as Components from './index';

import * as Services from '../services/index';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class AddressInformation extends Component {
  state = {
    street: '',
    region: '',
    mileStone: '',
    building: '',
    information: '',
    edtingfeild: '',
    cityList: [],
    citiesArray: [],
    city: null,
  };
  async componentDidMount() {
    if (this.props.address.streetName) {
      this.setState({
        street: this.props.address.streetName,
      });
    }

    if (this.props.address.subAdminArea) {
      this.setState({
        region: this.props.address.subAdminArea,
      });
    }

    if (this.props.address.locality) {
      this.setState({
        mileStone: this.props.address.locality,
      });
    }

    if (this.props.address.streetNumber) {
      this.setState({
        building: this.props.address.streetNumber,
      });
    }

    try {
      let cities = await Services.EstateServices.cityList();
      if (cities) {
        let cityNames = [];
        let cityIds = [];
        for (let i = 0; i < cities.length; i++) {
          cityIds.push(cities[i]);
          cityNames.push(
            AppConstant.API.Language == 'ar'
              ? cities[i].name_ar
              : cities[i].name,
          );
        }
        this.setState({ cityList: cityNames, citiesArray: cityIds });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  onFocus(name) {
    this.setState({
      edtingfeild: name,
    });
  }

  onBlur(name) {
    this.setState({
      edtingfeild: '',
    });
  }
  dropdown_category_onSelect = (idx, value) => {
    let items = this.state.citiesArray[idx];
    this.setState({ city: items });
  };
  submitAction = () => {
    if (this.state.region.trim() == '') {
      Common.Alert.show('enter_region');
    } else if (this.state.street.trim() == '') {
      Common.Alert.show('enter_street');
    } else if (this.state.building.trim() == '') {
      Common.Alert.show('enter_building');
    } else if (this.state.mileStone.trim() == '') {
      Common.Alert.show('enter_milestone');
    } else if (this.state.city == null) {
      Common.Alert.show('select_city');
    } else {
      this.props.addressInformation({
        region: this.state.region,
        landmarks: this.state.mileStone,
        building_number: this.state.building,
        address: this.state.street,
        additional: this.state.information,
        city_id: this.state.city.id,
        // latitude :city.latitude,
        // longitude: city.longitude
      });
    }
  };
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'rgba(0,0,0,0.54)',
          width: '100%',
          height: '100%',
          zIndex: 10,
          position: 'absolute',

        }}
        onStartShouldSetResponder={this.props.closePicker}>
        <View style={[styles.container, this.props.containerStyle]}>
          <View
            style={{
              width: '100%',
              height: hp('2%'),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: wp('20%'),
                height: 2,
                // backgroundColor: '#E0E0E0',
                marginLeft: wp('40%'),
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <KeyboardAwareScrollView
              // enableOnAndroid={false}
              contentContainerStyle={styles.mainContainer}
              keyboardShouldPersistTaps="handled">
              <Components.AmlakHeader
                height={hp('11%')}
                isButtons={true}
                leftButton={Constants.Images.closeBig}
                title={Common.Translations.translate('exact_location_map')}
                onSettingClick={() => {
                  this.props.closePicker()
                }}
                onBackButtonClick={() => {
                  this.props.closePicker()

                }}
              />
              {/* <View style={{
                flexDirection:"row",
                paddingBottom:25,
                justifyContent:"center",

              }}>

                <TouchableOpacity
                  // onPress={props.onCross}
                  style={{ marginLeft: wp('4%'),}}>
                  <Image source={AppConstant.Images.closeBig} />
                </TouchableOpacity>
                <Text
                  style={{
                    width: '70%',
                    textAlign: 'right',
                    fontFamily: AppConstant.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('exact_location_map')}
                </Text>
              </View> */}

              <Text
                style={{
                  width: '70%',
                  textAlign: 'right',
                  fontFamily: AppConstant.Fonts.shamel,
                  fontSize: wp('3%'),
                  color: '#BCB5B5',
                }}>
                {this.props.address.formattedAddress}
              </Text>

              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: wp('6%'),
                }}>
                <Text
                  style={{
                    width: '90%',
                    textAlign: 'right',
                    fontFamily: AppConstant.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('3%'),
                    color: '#006FEB',
                    paddingRight: wp('8%'),
                  }}>
                  {Common.Translations.translate('add_more_detail_for_location')}
                </Text>
                <Image source={AppConstant.Images.help} />
              </View>
              <View
                style={{
                  width: '95%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor:'red',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: AppConstant.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginBottom: wp('1%'),
                      height: hp('2.5%'),
                    }}>
                    {Common.Translations.translate('street')}
                  </Text>
                  <TextInput
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus('street')}
                    style={{
                      height: hp('4%'),
                      borderColor: 'gray',
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        this.state.edtingfeild == 'street'
                          ? '#006FEB'
                          : '#BCB5B5',
                      textAlign: 'right',
                      paddingVertical: 0,
                    }}
                    placeholder={Common.Translations.translate('example_street')}
                    onChangeText={(text) => this.setState({ street: text })}
                    value={this.state.street}
                  />
                </View>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: AppConstant.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginBottom: wp('1%'),
                      height: hp('2.5%'),
                    }}>
                    {Common.Translations.translate('region')}
                  </Text>
                  <TextInput
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus('region')}
                    style={{
                      height: hp('4%'),
                      borderColor: 'gray',
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        this.state.edtingfeild == 'region'
                          ? '#006FEB'
                          : '#BCB5B5',
                      textAlign: 'right',
                      paddingVertical: 0,
                    }}
                    placeholder={Common.Translations.translate('example_region')}
                    onChangeText={(text) => this.setState({ region: text })}
                    value={this.state.region}
                  />
                </View>
              </View>
              <View
                style={{
                  width: '95%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: wp('2%'),
                }}>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: AppConstant.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginBottom: wp('1%'),
                      height: hp('2.5%'),
                    }}>
                    {Common.Translations.translate('near_milestone')}
                  </Text>
                  <TextInput
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus('milestone')}
                    style={{
                      height: hp('4%'),
                      borderColor: 'gray',
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        this.state.edtingfeild == 'milestone'
                          ? '#006FEB'
                          : '#BCB5B5',
                      textAlign: 'right',
                      paddingVertical: 0,
                    }}
                    placeholder={Common.Translations.translate(
                      'example_near_milestone',
                    )}
                    onChangeText={(text) => this.setState({ mileStone: text })}
                    value={this.state.mileStone}
                  />
                </View>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: AppConstant.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginBottom: wp('1%'),
                      height: hp('2.5%'),
                    }}>
                    {Common.Translations.translate('building')}
                  </Text>
                  <TextInput
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus('building')}
                    style={{
                      height: hp('4%'),
                      borderColor: 'gray',
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        this.state.edtingfeild == 'building'
                          ? '#006FEB'
                          : '#BCB5B5',
                      textAlign: 'right',
                      paddingVertical: 0,
                    }}
                    placeholder={Common.Translations.translate('my_choice')}
                    onChangeText={(text) => this.setState({ building: text })}
                    value={this.state.building}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  width: '90%',
                  marginTop: wp('3%'),
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: AppConstant.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginBottom: wp('1%'),
                  }}>
                  {Common.Translations.translate('additional_inormation')}
                </Text>
                <TextInput
                  onBlur={() => this.onBlur()}
                  onFocus={() => this.onFocus('information')}
                  style={{
                    height: hp('4%'),
                    borderColor: 'gray',
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      this.state.edtingfeild == 'information'
                        ? '#006FEB'
                        : '#BCB5B5',
                    textAlign: 'right',
                    paddingVertical: 0,
                  }}
                  placeholder={Common.Translations.translate('my_choice')}
                  onChangeText={(text) => this.setState({ information: text })}
                  value={this.state.information}
                />
              </View>

              <View
                style={{
                  width: '90%',
                  overflow: 'hidden',
                  marginTop: wp('4%'),
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    fontFamily: AppConstant.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginBottom: wp('1%'),
                  }}>
                  {Common.Translations.translate('city')}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: wp('2%'),
                    borderColor: '#E1E1E1',
                    borderBottomWidth: 1,
                  }}>
                  <Image
                    source={AppConstant.Images.menuIcon}
                    style={{
                      width: wp('3%'),
                      height: wp('3%'),
                      marginLeft: wp('3%'),
                    }}
                    resizeMode="contain"
                  />
                  <ModalDropdown
                    style={{
                      width: '90%',
                    }}
                    textStyle={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: AppConstant.Fonts.shamelBold,
                      fontSize: wp('3.5%'),
                    }}
                    dropdownStyle={{ width: '85%' }}
                    dropdownTextStyle={{
                      textAlign: 'right',
                      color: 'black',
                      fontFamily: AppConstant.Fonts.shamel,
                      fontSize: wp('4%'),
                      marginRight: wp('2%'),
                    }}
                    options={this.state.cityList}
                    onSelect={(idx, value) =>
                      this.dropdown_category_onSelect(idx, value)
                    }
                    defaultValue={Common.Translations.translate('city')}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: wp('10%'),
              marginTop: wp('5%'),
              marginBottom: wp('8%'),
            }}>
            <AmlakButton
              title={'addition'}
              titleStyles={{ color: AppConstant.Colors.white }}
              containerStyles={{
                backgroundColor: AppConstant.Colors.buttonBackground,
              }}
              onClick={() => {
                this.submitAction();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default AddressInformation;

AddressInformation.propTypes = {
  addressInformation: PropTypes.func,
  closePicker: PropTypes.func,
  address: PropTypes.string,
};

AddressInformation.defaultProps = {
  addressInformation: () => { },
  closePicker: () => { },
  address: '',
};

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
    marginVertical: wp('4%'),
  },
  cellTitle: {
    textAlign: 'center',
    fontFamily: AppConstant.Fonts.shamel,
    fontSize: wp('3%'),
    width: wp('100%'),
  },
  mainContainer: {
    width: Common.Helper.dimensions().width,
    alignItems: 'center',
    paddingBottom: wp('2%'),
    // flexGrow: 1,
  }
});
