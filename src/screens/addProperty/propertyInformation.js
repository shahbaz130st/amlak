import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown-with-flatlist';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import User from '../../models/user';
let params = {};

class PropertyInformation extends Component {
  state = {
    name: '',
    propertyDescription: '',
    cat_id: null,
    price: '',
    area: '',
    year: '',
    facade: '',
    arrayFacade: [
      Common.Translations.translate('south'),
      Common.Translations.translate('west'),
      Common.Translations.translate('east'),
      Common.Translations.translate('north'),
    ],
    blockNumber: '',
    streetWidth: '',
    numberOfRooms: 0,
    numberOfHalls: 0,
    numberOfBathRooms: 0,
    floors: '',
    items: [],
    type: '',
    facilities: [],
    years: [],
    doors: [
      Common.Translations.translate('glass'),
      Common.Translations.translate('electronic'),
    ],
    landTypes: [
      Common.Translations.translate('living'),
      Common.Translations.translate('agriculture'),
    ],
    door_type: '',
    land_type: '',
    prices: ['USD', 'NIS', 'JOD'],
    currency: null,
    userInfo: null,
    female_only: '',
    veranda: 'off',
    electricity: 'off',
    water: 'off',
    Is_furnitarued: 'off',
    swimmingPool: 'off',
    Internal_staircase: 'off',
    Car_garage: 'off',
    Service_room: 'off',
    Elevator: 'off',
    is_wall_around: 'No',
    tapu:'No',
    a_b_c:'A',
    office_bath: 'No',

    genders: [
      Common.Translations.translate('male'),
      Common.Translations.translate('fe_male'),
      Common.Translations.translate('other'),

    ],
    livingTypes: [
      Common.Translations.translate('single'),
      Common.Translations.translate('family'),
      Common.Translations.translate('any')
    ],
    living_type: '',

  };

  async componentDidMount() {
    this.categroyList();
    var years = [];
    for (let i = 1920; i < 2022; i++) {
      years.push(`${i}`);
    }
    this.setState({years: years});
    if (this.props.category_id) {
      this.setState({cat_id: this.props.category_id});
    }
  }
  categroyList = async() => {
    let userInstance = User.getInstance();
    let items = [];
    let categories = [];
    console.log('userInstance.getUser().categories', userInstance.getUser());
    if (userInstance.getUser().categories) {
      for (let i = 0; i < userInstance.getUser().categories.length; i++) {
        items.push(userInstance.getUser().categories[i].name);
        categories.push(userInstance.getUser().categories[i]);
      }
      this.setState({items: items});
    }
    if (userInstance.getUser().info) {
      this.setState({userInfo: userInstance.getUser().info});
    }
    return categories;
  };

  dropdown_prices_onSelect = (idx, value) => {
    let items = this.state.prices[idx];
    this.setState({currency: items});
  };
  dropdown_category_onSelect = (idx, value) => {
    let items = this.categroyList()[idx];
    this.setState({cat_id: items.id});
  };
  dropdown_year_onSelect = (idx, value) => {
    this.setState({year: value});
  };
  dropdown_facade_onSelect = (idx, value) => {
    console.log("face property",idx)
    if(idx==0){
      this.setState({facade: "south"});
    }
    if(idx==1){
      this.setState({facade: "west"});
    }
    if(idx==2){
      this.setState({facade: "east"});
    }
    if(idx==3){
      this.setState({facade: "north"});
    }
  };
  dropdown_doorType_onSelect = (idx, value) => {
    let items = this.state.doors[idx];
    if (idx==0){
      this.setState({door_type: "glass"});
    }
    if(idx == 1) {
      this.setState({door_type: "electronic"});
    }

  };
  dropdown_genderType_onSelect = (idx, value) => {
    let items = this.state.genders[idx];
    console.log("gender selection",idx);
    if(idx==0){
      this.setState({female_only: "male"});
    }
    if(idx==1){
      this.setState({female_only: "Female"});
    }
    if(idx==2){
      this.setState({female_only: "both"});
    }

  };
  dropdown_LivingType_onSelect = (idx, value) => {
    let items = this.state.livingTypes[idx];
    if(idx==0){
      this.setState({living_type: "Single"});
    }
    if(idx==1){
      this.setState({living_type: "Family"});
    }
    if(idx==2){
      this.setState({living_type: "Any"});
    }
  };
  dropdown_landType_onSelect = (idx, value) => {
    let items = this.state.landTypes[idx];
    if (idx == 0){
      this.setState({land_type: "Building"});
    }
    if (idx == 1){
      this.setState({land_type: "Agriculture"});
    }
  };
  submitAction = () => {
    if (this.state.name.trim() == '') {
      Common.Alert.show('enter_property_name');
    } else if (this.state.propertyDescription.trim() == '') {
      Common.Alert.show('enter_property_description');
    } else if (this.state.cat_id == null) {
      Common.Alert.show('propert_type');
    } else if (this.state.price.trim() == '') {
      Common.Alert.show('enter_property_price');
    } else if (this.state.currency == null) {
      Common.Alert.show('select_currency');
    } else if (this.state.area.trim() == '') {
      Common.Alert.show('enter_property_estate_area');
    } else if (this.state.year == '') {
      Common.Alert.show('enter_year_of_construction');
    } else if (this.state.facade.trim() == '') {
      Common.Alert.show('enter_facade_property');
    } else if (this.state.blockNumber.trim() == '') {
      Common.Alert.show('enter_block_number');
    } else if (this.state.floors.trim() == '' && this.state.cat_id != 30) {
      Common.Alert.show('enter_floor_type');
    } else if (this.state.area.length == 0){
      Common.Alert.show('enter_property_estate_area');
    } else {
      let facilities = [];
      if (this.state.Is_furnitarued == true) {
        facilities.push('furnished');
      }
      if (this.state.swimmingPool == true) {
        facilities.push('swimming pool');
      }
      if (this.state.Internal_staircase == true) {
        facilities.push('internal staircase');
      }
      if (this.state.Car_garage == true) {
        facilities.push('car entrance');
      }
      if (this.state.Service_room == true) {
        facilities.push("maid's room");
      }
      if (this.state.Elevator == true) {
        facilities.push('Elevator');
      }
      const commaSep = facilities.map((item) => item).join(', ');
      console.log(commaSep);
      let params = {};
      // params['category_id'] = this.state.cat_id;
      params['number_of_bedrooms'] = this.state.numberOfRooms;
      params['number_of_halls'] = this.state.numberOfHalls;
      params['number_of_baths'] = this.state.numberOfBathRooms;
      // params['sale_or_rent'] = this.state.type;
      params['number_of_floors'] = this.state.floors;
      params['price'] = this.state.price;
      params['description'] = this.state.propertyDescription;
      params['is_furnitarued'] = this.state.Is_furnitarued;
      params['swimmingPool'] = this.state.swimmingPool;
      params['internal_staircase'] = this.state.Internal_staircase;
      params['car_garage'] = this.state.Car_garage;
      params['service_room'] = this.state.Service_room;
      params['elevator'] = this.state.Elevator;
      // params['door_type'] = this.state.door_type;
      params['currancy'] = this.state.currency;
      params['owner_number'] = this.state.userInfo.mobile;
      params['advertiser_name'] = this.state.userInfo.name;
      params['whatsApp_no'] = this.state.userInfo.mobile;
      params['gender_type'] = this.state.female_only;
      params['water'] = this.state.water;
      params['Veranda'] = this.state.veranda;
      params['electricity'] = this.state.electricity;
      params['area'] = this.state.area;
      params['total_area'] = this.state.area;
      params['side'] = this.state.facade;
      params['street_width'] = this.state.streetWidth;
      params['door_type'] = this.state.door_type;
      params['land_type'] = this.state.land_type;
      params['tapu'] = this.state.tapu;
      params['A_B_C'] = this.state.a_b_c;
      params['type_of_living'] = this.state.living_type;
      params['wall_around'] = this.state.is_wall_around;

      params['bath'] = this.state.office_bath;

      // params['facilities'] = commaSep;
      this.props.propertyAction(params);
    }
  };

  renderStreetWidth = () => {
    switch (this.state.cat_id) {
      case 50:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: wp('2%'),
            }}>
            <Text
              style={{
                marginTop: wp('4%'),
                width: '90%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('street_width')}
            </Text>
            <TextInput
              style={{
                height: hp('4%'),
                borderColor: '#E1E1E1',
                borderWidth: 0.5,
                textAlign: 'right',
                width: '90%',
                paddingRight: wp('2%'),
                paddingVertical: 0,
              }}
              placeholder={Common.Translations.translate('street_width')}
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={(text) => this.setState({streetWidth: text})}
              value={this.state.streetWidth}
            />
          </View>
        );
        case 60:
          return (
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: wp('2%'),
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('street_width')}
              </Text>
              <TextInput
                style={{
                  height: hp('4%'),
                  borderColor: '#E1E1E1',
                  borderWidth: 0.5,
                  textAlign: 'right',
                  width: '90%',
                  paddingRight: wp('2%'),
                  paddingVertical: 0,
                }}
                placeholder={Common.Translations.translate('street_width')}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={(text) => this.setState({streetWidth: text})}
                value={this.state.streetWidth}
              />
            </View>
          );
      case 40:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: wp('2%'),
            }}>
            <Text
              style={{
                marginTop: wp('4%'),
                width: '90%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('street_width')}
            </Text>
            <TextInput
              style={{
                height: hp('4%'),
                borderColor: '#E1E1E1',
                borderWidth: 0.5,
                textAlign: 'right',
                width: '90%',
                paddingRight: wp('2%'),
                paddingVertical: 0,
              }}
              placeholder={Common.Translations.translate('street_width')}
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={(text) => this.setState({streetWidth: text})}
              value={this.state.streetWidth}
            />
          </View>
        );
      default:
        return <View />;
        break;
    }
  };

  renderGenderType = () => {
    switch (this.state.cat_id) {
      case 10:
        return (
          <View
            style={{
              width: '81%',
              overflow: 'hidden',
              marginTop: wp('4%'),
              flexDirection: 'column',
            }}>
            <Text
              style={{
                width: '100%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('gender_type')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: wp('2%'),
                borderWidth: 1,
                borderColor: '#E1E1E1',
              }}>
              <Image
                source={Constants.Images.menuIcon}
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
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}
                dropdownStyle={{width: '75%'}}
                dropdownTextStyle={{
                  textAlign: 'right',
                  color: 'black',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('4%'),
                  marginRight: wp('2%'),
                }}
                options={this.state.genders}
                onSelect={(idx, value) =>
                  this.dropdown_genderType_onSelect(idx, value)
                }
                defaultValue={Common.Translations.translate('gender_type')}
              />
            </TouchableOpacity>
          </View>
        );

        case 20:
        return (
          <View
            style={{
              width: '81%',
              overflow: 'hidden',
              marginTop: wp('4%'),
              flexDirection: 'column',
            }}>
            <Text
              style={{
                width: '100%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('gender_type')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: wp('2%'),
                borderWidth: 1,
                borderColor: '#E1E1E1',
              }}>
              <Image
                source={Constants.Images.menuIcon}
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
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}
                dropdownStyle={{width: '75%'}}
                dropdownTextStyle={{
                  textAlign: 'right',
                  color: 'black',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('4%'),
                  marginRight: wp('2%'),
                }}
                options={this.state.genders}
                onSelect={(idx, value) =>
                  this.dropdown_genderType_onSelect(idx, value)
                }
                defaultValue={Common.Translations.translate('gender_type')}
              />
            </TouchableOpacity>
          </View>
        );

      default:
        return <View />;
        break;
    }
  };


  renderTypeOfLiving = () => {
    switch (this.state.cat_id) {
      case 10:
        return (
          <View
            style={{
              width: '81%',
              overflow: 'hidden',
              marginTop: wp('4%'),
              flexDirection: 'column',
            }}>
            <Text
              style={{
                width: '100%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('type_of_living')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: wp('2%'),
                borderWidth: 1,
                borderColor: '#E1E1E1',
              }}>
              <Image
                source={Constants.Images.menuIcon}
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
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}
                dropdownStyle={{width: '75%'}}
                dropdownTextStyle={{
                  textAlign: 'right',
                  color: 'black',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('4%'),
                  marginRight: wp('2%'),
                }}
                options={this.state.livingTypes}
                onSelect={(idx, value) =>
                  this.dropdown_LivingType_onSelect(idx, value)
                }
                defaultValue={Common.Translations.translate('type_of_living')}
              />
            </TouchableOpacity>
          </View>
        );

        case 20:
          return (
            <View
              style={{
                width: '81%',
                overflow: 'hidden',
                marginTop: wp('4%'),
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('type_of_living')}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                  borderWidth: 1,
                  borderColor: '#E1E1E1',
                }}>
                <Image
                  source={Constants.Images.menuIcon}
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
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('2.5%'),
                  }}
                  dropdownStyle={{width: '75%'}}
                  dropdownTextStyle={{
                    textAlign: 'right',
                    color: 'black',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    marginRight: wp('2%'),
                  }}
                  options={this.state.livingTypes}
                  onSelect={(idx, value) =>
                    this.dropdown_LivingType_onSelect(idx, value)
                  }
                  defaultValue={Common.Translations.translate('type_of_living')}
                />
              </TouchableOpacity>
            </View>
          );


      default:
        return <View />;
        break;
    }
  };

  renderDoorType = () => {
    switch (this.state.cat_id) {
      case 60:
        return (
          <View
            style={{
              width: '81%',
              overflow: 'hidden',
              marginTop: wp('4%'),
              flexDirection: 'column',
            }}>
            <Text
              style={{
                width: '100%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('door_type')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: wp('2%'),
                borderWidth: 1,
                borderColor: '#E1E1E1',
              }}>
              <Image
                source={Constants.Images.menuIcon}
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
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}
                dropdownStyle={{width: '75%'}}
                dropdownTextStyle={{
                  textAlign: 'right',
                  color: 'black',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('4%'),
                  marginRight: wp('2%'),
                }}
                options={this.state.doors}
                onSelect={(idx, value) =>
                  this.dropdown_doorType_onSelect(idx, value)
                }
                defaultValue={Common.Translations.translate('door_type')}
              />
            </TouchableOpacity>
          </View>
        );
      case 40:
        return (
          <View
            style={{
              width: '81%',
              overflow: 'hidden',
              marginTop: wp('4%'),
              flexDirection: 'column',
            }}>
            <Text
              style={{
                width: '100%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('3.5%'),
                marginBottom: wp('1.5%'),
              }}>
              {Common.Translations.translate('door_type')}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: wp('2%'),
                borderWidth: 1,
                borderColor: '#E1E1E1',
              }}>
              <Image
                source={Constants.Images.menuIcon}
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
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}
                dropdownStyle={{width: '75%'}}
                dropdownTextStyle={{
                  textAlign: 'right',
                  color: 'black',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('4%'),
                  marginRight: wp('2%'),
                }}
                options={this.state.doors}
                onSelect={(idx, value) =>
                  this.dropdown_doorType_onSelect(idx, value)
                }
                defaultValue={Common.Translations.translate('door_type')}
              />
            </TouchableOpacity>
          </View>
        );
        case 50:
          return (
            <View
              style={{
                width: '81%',
                overflow: 'hidden',
                marginTop: wp('4%'),
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('door_type')}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                  borderWidth: 1,
                  borderColor: '#E1E1E1',
                }}>
                <Image
                  source={Constants.Images.menuIcon}
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
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('2.5%'),
                  }}
                  dropdownStyle={{width: '75%'}}
                  dropdownTextStyle={{
                    textAlign: 'right',
                    color: 'black',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    marginRight: wp('2%'),
                  }}
                  options={this.state.doors}
                  onSelect={(idx, value) =>
                    this.dropdown_doorType_onSelect(idx, value)
                  }
                  defaultValue={Common.Translations.translate('door_type')}
                />
              </TouchableOpacity>
            </View>
          );
      default:
        return <View />;
        break;
    }
  };

  renderAttachments = () => {
    switch (this.state.cat_id) {
      case 50:
        return (
          <View style={{width: '100%'}}>
            <Text
              style={{
                marginTop: wp('10%'),
                width: '90%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('4%'),
              }}>
              {Common.Translations.translate('attachments')}
            </Text>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: wp('2%'),
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp('5%'),
                  }}>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfBathRooms: this.state.numberOfBathRooms + 1,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.plusIcon} />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      marginHorizontal: wp('4%'),
                    }}>
                    {this.state.numberOfBathRooms}
                  </Text>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfBathRooms:
                            this.state.numberOfBathRooms - 1 > 0
                              ? this.state.numberOfBathRooms - 1
                              : 0,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.minusIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('numberOfBathRooms')}
                </Text>
              </View>
            </View>
          </View>
        );
        case 40:
          return (
            <View style={{width: '100%'}}>
              <Text
                style={{
                  marginTop: wp('10%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('4%'),
                }}>
                {Common.Translations.translate('attachments')}
              </Text>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: wp('2%'),
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: wp('5%'),
                    }}>
                    <View
                      style={{
                        width: wp('10%'),
                        height: wp('10%'),
                        borderRadius: wp('10%') / 2,
                        borderWidth: 0.7,
                        borderColor: 'rgba(68,68,64,0.76)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            numberOfBathRooms: this.state.numberOfBathRooms + 1,
                          });
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image source={Constants.Images.plusIcon} />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        color: '#444040',
                        textAlign: 'right',
                        fontFamily: Constants.Fonts.shamel,
                        fontSize: wp('3.5%'),
                        marginHorizontal: wp('4%'),
                      }}>
                      {this.state.numberOfBathRooms}
                    </Text>
                    <View
                      style={{
                        width: wp('10%'),
                        height: wp('10%'),
                        borderRadius: wp('10%') / 2,
                        borderWidth: 0.7,
                        borderColor: 'rgba(68,68,64,0.76)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            numberOfBathRooms:
                              this.state.numberOfBathRooms - 1 > 0
                                ? this.state.numberOfBathRooms - 1
                                : 0,
                          });
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image source={Constants.Images.minusIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                    }}>
                    {Common.Translations.translate('numberOfBathRooms')}
                  </Text>
                </View>
              </View>
            </View>
          );

      case 60:
        return (
          <View style={{width: '100%'}}>
            <Text
              style={{
                marginTop: wp('10%'),
                width: '90%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('4%'),
              }}>
              {Common.Translations.translate('attachments')}
            </Text>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
               <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    office_bath:
                      this.state.office_bath == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.office_bath == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('bathRoom')}
                </Text>
              </View>
            </View>
            </View>
          </View>
        );

      case 30:
        return <View />;
      default:
        return (
          <View style={{width: '100%'}}>
            <Text
              style={{
                marginTop: wp('10%'),
                width: '90%',
                color: '#444040',
                textAlign: 'right',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('4%'),
              }}>
              {Common.Translations.translate('attachments')}
            </Text>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp('5%'),
                  }}>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfRooms: this.state.numberOfRooms + 1,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.plusIcon} />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      marginHorizontal: wp('4%'),
                    }}>
                    {this.state.numberOfRooms}
                  </Text>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfRooms:
                            this.state.numberOfRooms - 1 > 0
                              ? this.state.numberOfRooms - 1
                              : 0,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.minusIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('numberOfRooms')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: wp('2%'),
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp('5%'),
                  }}>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfHalls: this.state.numberOfHalls + 1,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.plusIcon} />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      marginHorizontal: wp('4%'),
                    }}>
                    {this.state.numberOfHalls}
                  </Text>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfHalls:
                            this.state.numberOfHalls - 1 > 0
                              ? this.state.numberOfHalls - 1
                              : 0,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.minusIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('numberOfHalls')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: wp('2%'),
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: wp('5%'),
                  }}>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfBathRooms: this.state.numberOfBathRooms + 1,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.plusIcon} />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      marginHorizontal: wp('4%'),
                    }}>
                    {this.state.numberOfBathRooms}
                  </Text>
                  <View
                    style={{
                      width: wp('10%'),
                      height: wp('10%'),
                      borderRadius: wp('10%') / 2,
                      borderWidth: 0.7,
                      borderColor: 'rgba(68,68,64,0.76)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          numberOfBathRooms:
                            this.state.numberOfBathRooms - 1 > 0
                              ? this.state.numberOfBathRooms - 1
                              : 0,
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={Constants.Images.minusIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('numberOfBathRooms')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;
    }
  };

  renderFacilities = () => {
    switch (this.state.cat_id) {
      case 10: //Apartment
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
          <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu:
                      this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>

            {/* <View
              style={{
                marginTop: wp('3%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    female_only: this.state.female_only == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.female_only == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('female_only')}
                </Text>
              </View>
            </View> */}

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: wp('3%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Is_furnitarued:
                      this.state.Is_furnitarued == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Is_furnitarued == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    veranda: this.state.veranda == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.veranda == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('veranda')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Service_room:
                      this.state.Service_room == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Service_room == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('maids_room')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 20: //home
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
          <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu:
                      this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>

            {/* <View
              style={{
                marginTop: wp('3%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    female_only: this.state.female_only == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.female_only == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('female_only')}
                </Text>
              </View>
            </View> */}

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: wp('3%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Is_furnitarued:
                      this.state.Is_furnitarued == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Is_furnitarued == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    veranda: this.state.veranda == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.veranda == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('veranda')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Service_room:
                      this.state.Service_room == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Service_room == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('maids_room')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Internal_staircase:
                      this.state.Internal_staircase == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Internal_staircase == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('internal_staircase')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 30: //Land
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu: this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    is_wall_around: this.state.is_wall_around == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.is_wall_around == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('surrounded_with_wall')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 40: //Shop//Wharehouse//Office
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu:
                      this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;
      case 50: //Shop//Wharehouse//Office
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu:
                      this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 60: //Shop//Wharehouse//Office
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    tapu:
                      this.state.tapu == 'No' ? 'Yes' : 'No',
                  });
                }}>
                <Image
                  source={
                    this.state.tapu == 'Yes'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('tapu')}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 70: //Roof
        return (
          <View style={{width: '100%', flexDirection: 'column'}}>
            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Car_garage: this.state.Car_garage == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Car_garage == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Elevator: this.state.Elevator == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Elevator == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: wp('3%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Is_furnitarued:
                      this.state.Is_furnitarued == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.Is_furnitarued == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    water: this.state.water == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.water == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: wp('2%'),
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    electricity: this.state.electricity == 'off' ? 'on' : 'off',
                  });
                }}>
                <Image
                  source={
                    this.state.electricity == 'on'
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '95%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: wp('2%'),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Internal_staircase: !this.state.Internal_staircase,
                  });
                }}>
                <Image
                  source={
                    this.state.Internal_staircase == true
                      ? Constants.Images.filterCheck
                      : Constants.Images.filterUncheck
                  }
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('internal_staircase')}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      default:
        return <View />;
        break;
    }
  };
  render() {
    return (
      <SafeAreaView
        style={[
          {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: '#FDFDFD',
          },
          this.props.containerStyle,
        ]}>
        <KeyboardAwareScrollView
          // enableOnAndroid={true}
          contentContainerStyle={styles.mainContainer}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              //   backgroundColor: 'red',
            }}>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('property_name')}
              </Text>
              <TextInput
                style={{
                  height: hp('4%'),
                  borderColor: '#E1E1E1',
                  borderWidth: 0.5,
                  textAlign: 'right',
                  width: '90%',
                  paddingRight: wp('2%'),
                  paddingVertical: 0,
                }}
                placeholder={Common.Translations.translate(
                  'example_property_name',
                )}
                onChangeText={(text) => this.setState({name: text})}
                value={this.state.name}
              />
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: wp('2%'),
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('property_description')}
              </Text>
              <TextInput
                style={{
                  height: hp('4%'),
                  borderColor: '#E1E1E1',
                  borderWidth: 0.5,
                  textAlign: 'right',
                  width: '90%',
                  paddingRight: wp('2%'),
                  paddingVertical: 0,
                }}
                placeholder={Common.Translations.translate(
                  'example_property_description',
                )}
                onChangeText={(text) =>
                  this.setState({propertyDescription: text})
                }
                value={this.state.propertyDescription}
              />
            </View>
            {this.renderStreetWidth()}
            {this.renderGenderType()}
            {this.renderTypeOfLiving()}

            {/* <View
              style={{
                width: '81%',
                overflow: 'hidden',
                marginTop: wp('4%'),
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('2.5%'),
                }}>
                {Common.Translations.translate('category_of_property')}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                  borderWidth: 1,
                  borderColor: '#E1E1E1',
                }}>
                <Image
                  source={Constants.Images.menuIcon}
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
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('2.5%'),
                  }}
                  dropdownStyle={{ width: '75%' }}
                  dropdownTextStyle={{
                    textAlign: 'right',
                    color: 'black',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('2%'),
                  }}
                  options={this.state.items}
                  onSelect={(idx, value) =>
                    this.dropdown_category_onSelect(idx, value)
                  }
                  defaultValue={Common.Translations.translate(
                    'category_of_property',
                  )}
                />
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: wp('2%'),
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('price_of_property')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <TextInput
                  style={{
                    height: hp('4%'),
                    borderColor: '#E1E1E1',
                    borderWidth: 0.5,
                    textAlign: 'right',
                    width: '60%',
                    paddingRight: wp('2%'),
                    paddingVertical: 0,
                  }}
                  placeholder={Common.Translations.translate(
                    'example_price_property_value',
                  )}
                  onChangeText={(text) => this.setState({price: text})}
                  value={this.state.price}
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: wp('2%'),
                    borderWidth: 1,
                    borderColor: '#E1E1E1',
                  }}>
                  <Image
                    source={Constants.Images.menuIcon}
                    style={{
                      width: wp('3%'),
                      height: wp('3%'),
                      marginLeft: wp('3%'),
                    }}
                    resizeMode="contain"
                  />
                  <ModalDropdown
                    style={{
                      alignSelf: 'flex-end',
    width: wp('24%'),
                    }}
                    textStyle={{
                      color: '#444040',
                      textAlign: 'right',
                      fontFamily: Constants.Fonts.shamelBold,
                      fontSize: wp('2.5%'),
                    paddingRight:10
                    }}
                    dropdownTextStyle={{
                      textAlign: 'right',
                      color: 'black',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('4%'),
                    }}
                    options={this.state.prices}
                    onSelect={(idx, value) =>
                      this.dropdown_prices_onSelect(idx, value)
                    }
                    //  adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                    defaultValue={Common.Translations.translate('currency')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: wp('2%'),
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('real_estate_area')}
              </Text>
              <TextInput
                style={{
                  height: hp('4%'),
                  borderColor: '#E1E1E1',
                  borderWidth: 0.5,
                  textAlign: 'right',
                  width: '90%',
                  paddingRight: wp('2%'),
                  paddingVertical: 0,
                }}
                placeholder={'420 م2'}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={(text) => this.setState({area: text})}
                value={this.state.area}
              />
            </View>
            <View
              style={{
                width: '81%',
                overflow: 'hidden',
                marginTop: wp('4%'),
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('year_of_construction')}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                  borderWidth: 1,
                  borderColor: '#E1E1E1',
                }}>
                <Image
                  source={Constants.Images.menuIcon}
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
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.5%'),
                  }}
                  dropdownStyle={{width: '75%'}}
                  dropdownTextStyle={{
                    textAlign: 'right',
                    color: 'black',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    marginRight: wp('2%'),
                  }}
                  options={this.state.years}
                  onSelect={(idx, value) =>
                    this.dropdown_year_onSelect(idx, value)
                  }
                  defaultValue={Common.Translations.translate(
                    'year_of_construction',
                  )}
                />
              </TouchableOpacity>
            </View>
            {this.renderDoorType()}

            {this.state.cat_id == 30 ? (
              <View
                style={{
                  width: '81%',
                  overflow: 'hidden',
                  marginTop: wp('4%'),
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    width: '100%',
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.5%'),
                    marginBottom: wp('1.5%'),
                  }}>
                  {Common.Translations.translate('type_land')}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: wp('2%'),
                    borderWidth: 1,
                    borderColor: '#E1E1E1',
                  }}>
                  <Image
                    source={Constants.Images.menuIcon}
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
                      fontFamily: Constants.Fonts.shamelBold,
                      fontSize: wp('2.5%'),
                    }}
                    dropdownStyle={{width: '75%'}}
                    dropdownTextStyle={{
                      textAlign: 'right',
                      color: 'black',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('4%'),
                      marginRight: wp('2%'),
                    }}
                    options={this.state.landTypes}
                    onSelect={(idx, value) =>
                      this.dropdown_landType_onSelect(idx, value)
                    }
                    defaultValue={Common.Translations.translate('type_land')}
                  />
                </TouchableOpacity>
              </View>
            ) : null}

            <View
              style={{
                width: '81%',
                overflow: 'hidden',
                marginTop: wp('4%'),
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('facacde_of_property')}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                  borderWidth: 1,
                  borderColor: '#E1E1E1',
                }}>
                <Image
                  source={Constants.Images.menuIcon}
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
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3.5%'),
                  }}
                  placeholder={Common.Translations.translate(
                    'example_facade_property',
                  )}
                  dropdownStyle={{width: '75%'}}
                  dropdownTextStyle={{
                    textAlign: 'right',
                    color: 'black',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    marginRight: wp('2%'),
                  }}
                  options={this.state.arrayFacade}
                  onSelect={(idx, value) =>
                    this.dropdown_facade_onSelect(idx, value)
                  }
                  defaultValue={Common.Translations.translate(
                    'facacde_of_property',
                  )}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: wp('2%'),
              }}>
              <Text
                style={{
                  marginTop: wp('4%'),
                  width: '90%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  marginBottom: wp('1.5%'),
                }}>
                {Common.Translations.translate('block_number')}
              </Text>
              <TextInput
                style={{
                  height: hp('4%'),
                  borderColor: '#E1E1E1',
                  borderWidth: 0.5,
                  textAlign: 'right',
                  width: '90%',
                  paddingRight: wp('2%'),
                  paddingVertical: 0,
                }}
                placeholder={Common.Translations.translate(
                  'example_block_number',
                )}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={(text) => this.setState({blockNumber: text})}
                value={this.state.blockNumber}
              />
            </View>
            {this.renderAttachments()}
            {this.state.cat_id != 30 ? (
              <View style={{width: '90%', flexDirection: 'column'}}>
                <Text
                  style={{
                    marginTop: wp('6%'),
                    width: '100%',
                    color: '#444040',
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('4%'),
                    marginBottom: wp('3%'),
                    paddingRight: wp('5%'),
                  }}>
                  {Common.Translations.translate('roleNumber')}
                </Text>
                <View style={{width: '100%', flexDirection: 'column'}}>
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({floors: '1'});
                      }}>
                      <Image
                        source={
                          this.state.floors == '1'
                            ? Constants.Images.filterCheck
                            : Constants.Images.filterUncheck
                        }
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                        }}>
                        {Common.Translations.translate('basements')}
                      </Text>
                      <Text
                        style={{
                          marginTop: wp('1%'),
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('2%'),
                        }}>
                        {Common.Translations.translate('basementMessage')}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: wp('2%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({floors: '4'});
                      }}>
                      <Image
                        source={
                          this.state.floors == '4'
                            ? Constants.Images.filterCheck
                            : Constants.Images.filterUncheck
                        }
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                        }}>
                        {Common.Translations.translate('mezzanines')}
                      </Text>
                      <Text
                        style={{
                          marginTop: wp('0.3%'),
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('2.5%'),
                        }}>
                        {Common.Translations.translate('mezzaninesMessage')}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: wp('2%'),
                      width: '95%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({floors: '10'});
                      }}>
                      <Image
                        source={
                          this.state.floors == '10'
                            ? Constants.Images.filterCheck
                            : Constants.Images.filterUncheck
                        }
                      />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                        }}>
                        {Common.Translations.translate('upperFloors')}
                      </Text>
                      <Text
                        style={{
                          marginTop: wp('0.3%'),
                          color: '#444040',
                          textAlign: 'right',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('2.5%'),
                        }}>
                        {Common.Translations.translate('upperFloorsMessage')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={{width: '90%', flexDirection: 'column'}}>
              <Text
                style={{
                  marginTop: wp('6%'),
                  width: '100%',
                  color: '#444040',
                  textAlign: 'right',
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('4%'),
                  marginBottom: wp('3%'),
                }}>
                {Common.Translations.translate('comfortable_features')}
              </Text>
              {this.renderFacilities()}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            width: '100%',
            height: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp('10%'),
          }}>
          <Components.AmlakButton
            title={'post_the_advertisement'}
            titleStyles={{color: Constants.Colors.white}}
            containerStyles={{
              backgroundColor: Constants.Colors.buttonBackground,
            }}
            onClick={() => {
              this.submitAction();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: Common.Helper.dimensions().width,
    alignItems: 'center',
    paddingBottom: wp('5%'),
    // flexGrow: 1,
  },
});

export default PropertyInformation;
