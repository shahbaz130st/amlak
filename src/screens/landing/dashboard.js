import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { EventRegister } from 'react-native-event-listeners';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import User from '../../models/user';
import messaging from '@react-native-firebase/messaging';
import AvatarComponent from "../../components/AvatarComponent";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.page = 10;
    this.state = {
      showInfo: false,
      isList: true,
      isFilter: true,
      selectedFilter: null,
      showPicker: false,
      showBottomPicker: false,
      searchKeyword: '',
      arrayEstates: [],
      items: [],
      markers: [],
      markerInfo: {},
      sortActive: false,
      sortOptions: [
        { name: Common.Translations.translate('sortBy'), id: '0' },
        // {name: Common.Translations.translate('popular'), id: '1'},
        { name: Common.Translations.translate('Price_low'), id: '2' },
        { name: Common.Translations.translate('Price_high'), id: '3' },
        { name: Common.Translations.translate('distace_circumference'), id: '4' },
        { name: Common.Translations.translate('rating_one'), id: '5' },
        { name: Common.Translations.translate('rating_five'), id: '6' },
      ],
      refreshing: false,
      currentLocation: {
        latitude: 31.7683, //32.2211,
        longitude: 35.2137, //35.2544
      },
      loadMore: false,
      isFilterEvent: false,
      isShowLocation: false,
      forceRefresh: '333',
    };
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  async componentDidMount() {
    this.props.toggleLoader(true);
    let token = await Common.KeyChain.get('authToken');
    if (token != null) {
      Constants.API.Token = token;
      try {
        let userRes = await Services.AuthServices.userData();
        if (userRes) {
          let userInstance = User.getInstance();
          userInstance.setUser(userRes);
          if (
            userInstance.getUser().categories &&
            userInstance.getUser().categories.length > 0
          ) {
            let allDict = { id: 0, name: Common.Translations.translate('all') };
            let array = [allDict, ...userInstance.getUser().categories];
            this.setState({ items: array });
          }
          Common.Helper.logEvent('dashboard', {
            user: userInstance.getUser().info.name,
          });
        }
      } catch (error) { }
    } else {
      let values = await Services.EstateServices.categories();
      if (values && values.length > 0) {
        let allDict = { id: 0, name: Common.Translations.translate('all') };
        let array = [allDict, ...values];
        this.setState({ items: array });
      }
    }

    try {
      let location = await Common.Helper.location();
      if (location) {
        this.setState({
          currentLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
        this.setState({
          isShowLocation: !this.state.isShowLocation,
          forceRefresh: `${Math.floor(Math.random() * 100)}`,
        });
      }
    } catch (error) { }

    this.showItems(10);


    this.configureListener();
    this.checkPermission();
  }

  async refreshPageToHome() {
    try {
      let location = await Common.Helper.location();
      if (location) {
        this.setState({
          currentLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
        this.setState({
          isShowLocation: !this.state.isShowLocation,
          forceRefresh: `${Math.floor(Math.random() * 100)}`,
        });
        // this.mapRef.current.animateToRegion({
        //   latitude:location.latitude,
        //   longitude:location.longitude,
        //   latitudeDelta: 3,
        //   longitudeDelta: 3
        // })
        this.showItems(10);
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestUserPermission();
    }
  }

  async getToken() {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      // user has a device token
      Constants.API.FirebaseToken = fcmToken;
      Services.UserServices.deviceinfo(fcmToken);
    }
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getToken();
    }
  }

  showItems = async (size) => {
    let estateRes = await Services.EstateServices.defaultEstates({
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      zoom: size,
    });
    this.props.toggleLoader(false);
    if (estateRes.data) {
      this.showProperties(estateRes.data);
    }
  };

  renderMarkers(estateRes, add) {
    let arrayMarkers = [];
    for (let i = 0; i < estateRes.length; i++) {
      let marker = {};
      marker.price =
        `${Common.Helper.sign(estateRes[i].currancy)}` + estateRes[i].price;
      marker.latitude = estateRes[i].latitude;
      marker.longitude = estateRes[i].longitude;
      marker.key = `${estateRes[i].id}`;
      marker.product = estateRes[i];
      arrayMarkers.push(marker);
    }

    if (add) {
      this.setState({ markers: [...this.state.markers, ...arrayMarkers] }); //another array
    } else {
      this.setState({ markers: arrayMarkers });
    }
    let uniqueMarkers = this.state.markers.filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    this.setState({ markers: uniqueMarkers });
  }

  showProperties(estateRes, add) {
    if (add) {
      this.setState({ arrayEstates: [...this.state.arrayEstates, ...estateRes] }); //another array
    } else {
      this.setState({ arrayEstates: estateRes });
    }
    let uniqueEstates = this.state.arrayEstates.filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    this.setState({ arrayEstates: uniqueEstates });
    this.renderMarkers(estateRes, add);
  }

  configureListener() {
    // this.props.navigation.addListener('focus', () => {
    //   console.log('--->',this.state.isFilterEvent);
    //   if (this.state.isFilterEvent == false) {
    //     this.setState({ selectedFilter: null })
    //     this.showItems(10)
    //   }
    // });

    this.listener = EventRegister.addEventListener(
      'filterProperties',
      (data) => {
        this.setState({ isFilterEvent: true, loadMore: false });
        this.showProperties(data);
        setTimeout(() => {
          this.setState({ isFilterEvent: false });
        }, 2000);
      },
    );
  }
  renderProerties = (item) => {
    switch (item.category_id) {
      case 60:
        return (
          <React.Fragment>
            {item?.details?.office_area &&
              item?.details?.office_area != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.floor_number == undefined
                      ? ''
                      : item?.details?.floor_number +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.door_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar'
                        ? item?.details?.door_type_arabic
                        : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.office_area == undefined
                      ? ''
                      : item?.details?.office_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
        break;
      case 30:
        return (
          <React.Fragment>
            {item?.details?.land_area &&
              item?.details?.land_area != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.land_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar'
                        ? item?.details?.land_type_arabic
                        : item?.details?.land_type}
                  </Text>
                  <Image source={Constants.Images.typeBlack} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.land_area == undefined
                      ? ''
                      : item?.details?.land_area +
                      ' ' +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
        break;
      case 50:
        return (
          <React.Fragment>
            {item?.details?.warehouse_area != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.no_of_bath == undefined
                      ? ''
                      : item?.details?.no_of_bath +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.door_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar'
                        ? item?.details?.door_type_arabic
                        : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.warehouse_street_width == undefined
                      ? ''
                      : item?.details?.warehouse_street_width +
                      ' ' +
                      Common.Translations.translate('m')}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.road}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.warehouse_area == undefined
                      ? ''
                      : item?.details?.warehouse_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
        break;
      case 40:
        return (
          <React.Fragment>
            {
              //item?.details?.warehouse_area != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {Constants.API.Language == 'ar'
                      ? item?.details?.door_type_arabic
                      : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.shop_street_width +
                      ' ' +
                      Common.Translations.translate('m')}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.road}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.bath == undefined
                      ? ''
                      : '1' + Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.shop_area == undefined
                      ? ''
                      : item?.details?.shop_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image
                    style={{ width: 10, height: 10 }}
                    source={Constants.Images.provinces}
                  />
                </View>
              </View>
              //) : null
            }
          </React.Fragment>
        );
        break;

      default:
        return (
          <React.Fragment>
            {item?.details?.number_of_baths != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_baths == undefined
                      ? ''
                      : item?.details?.number_of_baths +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_bedrooms == undefined
                      ? ''
                      : item?.details?.number_of_bedrooms +
                      ' ' +
                      Common.Translations.translate('bedRoom')}
                  </Text>
                  <Image source={Constants.Images.bed} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_halls == undefined
                      ? ''
                      : item?.details?.number_of_halls +
                      ' ' +
                      Common.Translations.translate('galleries')}
                  </Text>
                  <Image source={Constants.Images.tub} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.total_area == undefined
                      ? ''
                      : item?.details?.total_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
        break;
    }
  };

  loginAlert = () =>
    Alert.alert('', Common.Translations.translate('login_required'), [
      {
        text: Common.Translations.translate('ok'),
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: Common.Translations.translate('login'),
        onPress: () => {
          setTimeout(() => {
            this.props.navigation.navigate(
              Constants.Navigations.Onboarding.LOGIN,
            );
          }, 1000);
        },
        style: 'cancel',
      },
    ]);

  renderItem = (value) => {
    let Image_Http_URL = Constants.API.ImageBaseURL(value.item.picture[0].picture)
    // value.item.picture.length > 0
    //   ? { uri: Constants.API.ImageBaseURL(value.item.picture[0].picture) }
    //   : Constants.Images.cover;
    // let Image_Http_URL = Constants.Images.cover;
    // try {
    //   let Image_Http_URL =
    //     value.item.picture.length > 0
    //       ? { uri: Constants.API.ImageBaseURL(value.item.picture[0].picture) }
    //       : Constants.Images.cover;
    // } catch (error) {
    //   console.log(error)
    //   return <View />;
    // }
    return (
      <View
        style={{
          width: wp('100%'),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: wp('2%'),
        }}>
        <TouchableOpacity
          onPress={() => {
            // if (Constants.API.Token == null) {
            //   this.loginAlert();
            //   return;
            // }
            this.props.navigation.navigate(
              Constants.Navigations.Dashboard.DETAIL,
              { id: value.item.id },
            );
          }}>
          <View
            style={{
              width: wp('90%'),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: wp('2%'),
            }}>
            <View
              style={{
                width: wp('90%'),
                minHeight: hp('23%'),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
              }}>
              <AvatarComponent
                size={'large'}
                disabled={true}
                defaultSource={Constants.Images.cover}
                source={Image_Http_URL}
                style={{ width: wp('80%'), height: hp('23%') }}
                imageStyle={{ width: wp('80%'), height: hp('23%') }}
              />
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: '#444040',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: wp('4%'),
                  paddingVertical: wp('0.5%'),
                  right: wp('7%'),
                  top: wp('1%'),
                  borderRadius: wp('1.2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    color: 'white',
                    marginTop: 2,
                  }}>
                  {Common.Helper.capitalize(
                    Common.Translations.translate(value.item.sale_or_rent),
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: wp('2%'),
                width: wp('90%'),
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  width: wp('70%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#B9B9B9',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {moment(value.item.property_announcement_date).format(
                    'DD/MM/YYYY',
                  )}
                </Text>
                <Text
                  style={{
                    color: '#006FEB',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.5%'),
                  }}>
                  {`${Common.Helper.sign(value.item.currancy)}` +
                    value.item.price}
                </Text>
              </View>

              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginVertical: wp('1%'),
                }}>
                <Text
                  style={{
                    color: '#444040',
                    width: wp('80%'),
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3'),
                  }}>
                  {value.item.category_name +
                    ' ' +
                    Common.Helper.capitalize(
                      Common.Translations.translate(value.item.sale_or_rent),
                    )}
                </Text>
                {this.renderProerties(value.item)}
              </View>
              <View
                style={{
                  width: wp('90%'),
                  height: hp('2%'),
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  paddingRight: wp('8%'),
                }}>
                <Text
                  style={{
                    color: '#444040',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                    marginRight: wp('2%'),
                  }}>
                  {`${value.item.region} ${value.item.address} ${value.item.city_id_arabic == undefined
                    ? ''
                    : Constants.API.Language == 'ar'
                      ? value.item.city_id_arabic
                      : value.item.city_id}
                    `}
                </Text>

                <Image source={Constants.Images.locationBlack} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            padding: wp('3%'),
            backgroundColor: 'rgba(255,255,255,0.56)',
            width: wp('10%'),
            height: wp('10%'),
            borderRadius: wp('10%') / 2,
            justifyContent: 'center',
            alignItems: 'center',
            top: wp('2.5%'),
            left: wp('12%'),
          }}>
          <TouchableOpacity>
            <Image
              source={
                value.item.is_fav == false
                  ? Constants.Images.heartGray
                  : Constants.Images.heartRed
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  mapView = () => {
    let arrayFilter =
      this.state.selectedFilter == null
        ? this.state.markers
        : this.state.sortActive
          ? this.mapSortBy()
          : this.filterMap();

    return (
      <Components.AmlakMap
        provider={1}
        reference={reff => this.mapRef = reff}
        region={{
          // latitude:
          //   this.state.markers.length > 0
          //     ? parseFloat(this.state.markers[0].latitude)
          //     : this.state.currentLocation.latitude,
          // longitude:
          //   this.state.markers.length > 0
          //     ? parseFloat(this.state.markers[0].longitude)
          //     : this.state.currentLocation.longitude,
          latitude: this.state.currentLocation.latitude,
          longitude: this.state.currentLocation.longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}
        forceRefresh={this.state.forceRefresh}
        showsUserLocation={this.state.isShowLocation}
        markers={arrayFilter}
        onMapPress={(e) => {
          this.setState({ showInfo: true, markerInfo: e });
        }}
        regionChange={(e, p) => {
          this.setState({
            currentLocation: {
              latitude: e.latitude,
              longitude: e.longitude,
            },
          });
          // setTimeout(() => {
          //   this.page = 25;
          //   this.showItems(this.page);
          // }, 1000);
        }}
      />
    );
  };
  refreshList = async () => {
    this.page = 10;
    this.setState({ refreshing: true });
    let estateRes = await Services.EstateServices.defaultEstates({
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      zoom: this.page,
    });
    this.setState({ refreshing: false });
    if (estateRes.data) {
      console.log('Listing Response', estateRes.data);
      this.showProperties(estateRes.data);
    }
  };

  listView = () => {
    let array =
      this.state.selectedFilter == null
        ? this.state.arrayEstates
        : this.state.sortActive
          ? this.sortBy()
          : this.filterList();
    return (
      <View
        style={{
          height: hp('70%'),
          width: wp('100%'),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {array.length == 0 ? (
          <Text
            style={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('5%'),
            }}>
            {Common.Translations.translate('no_record_found')}
          </Text>
        ) : (
          <FlatList
            data={array}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.id}`}
            extraData={this.state.selectedFilter}
            onRefresh={this.refreshList}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                this.handleLoadMore(); // LOAD MORE DATA
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
          />
        )}
      </View>
    );
  };

  filterList = () => {
    if (this.state.selectedFilter.id == 0) {
      let filterdArray = this.state.arrayEstates;
      return filterdArray;
    } else {
      let filterdArray = this.state.arrayEstates
        .filter((item) => item.category_id == this.state.selectedFilter.id)
        .map((item) => item);
      return filterdArray;
    }
  };

  filterMap = () => {
    let filterdArray = [];
    if (this.state.selectedFilter.id == 0) {
      filterdArray = [...this.state.markers];
    } else {
      filterdArray = [...this.state.markers]
        .filter(
          (item) => item.product.category_id == this.state.selectedFilter.id,
        )
        .map((item) => item);
    }
    if (filterdArray.length == 0 && this.state.showPicker == false) {
      this.showAlert();
    }
    return filterdArray;
  };

  showAlert() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      Alert.alert(
        '',
        Common.Translations.translate('no_record_found'),
        [
          {
            text: 'OK',
            onPress: () => {
              this.alertPresent = false;
            },
          },
        ],
        { cancelable: false },
      );
    }
  }

  sortList = (key, id) => {
    let filterdArray = this.state.arrayEstates
      .sort((a, b) => (a.color > b.color ? 1 : -1))
      .map((item) => item);
    return filterdArray;
  };

  sortMap = (key, id) => {
    let filterdArray = this.state.markers
      .sort((a, b) => (a.color > b.color ? 1 : -1))
      .map((item) => item);
    return filterdArray;
  };

  sortBy = () => {
    let array = this.state.arrayEstates.slice();
    switch (this.state.selectedFilter) {
      case '1':
        break;
      case '2':
        array = array.sort((a, b) => (a.price > b.price ? 1 : -1));
        break;
      case '3':
        array = array.sort((a, b) => (a.price < b.price ? 1 : -1));
        break;
      case '4':
        break;
      case '5':
        array = array.sort((a, b) =>
          a.owner_detail.star_rating > b.owner_detail.star_rating ? 1 : -1,
        );
        break;
      case '6':
        array = array.sort((a, b) =>
          a.owner_detail.star_rating < b.owner_detail.star_rating ? 1 : -1,
        );
        break;
      default:
        break;
    }
    return array;
  };

  mapSortBy = () => {
    let array = this.state.markers.slice();
    switch (this.state.selectedFilter) {
      case '1':
        break;
      case '2':
        array = array.sort((a, b) =>
          a.product.price > b.product.price ? 1 : -1,
        );
        break;
      case '3':
        array = array.sort((a, b) =>
          a.product.price < b.product.price ? 1 : -1,
        );
        break;
      case '4':
        break;
      case '5':
        array = array.sort((a, b) =>
          a.product.owner_detail.star_rating >
            b.product.owner_detail.star_rating
            ? 1
            : -1,
        );
        break;
      case '6':
        array = array.sort((a, b) =>
          a.product.owner_detail.star_rating <
            b.product.owner_detail.star_rating
            ? 1
            : -1,
        );
        break;
      default:
        break;
    }
    return array;
  };

  async searchResults() {
    if (this.state.searchKeyword.length > 0) {
      this.props.toggleLoader(true);
      let results = await Services.EstateServices.homeSearch(
        this.state.searchKeyword,
      );
      console.log('results', results);
      this.props.toggleLoader(false);
      if (results) {
        this.showProperties(results);
        // let arrayMarkers = [];
        // for (let i = 0; i < results.length; i++) {
        //   if (results[i].price) {
        //     let marker = {};
        //     marker.price =
        //       `${Common.Helper.sign(results[i].currancy)}` + results[i].price;
        //     marker.latitude = results[i].latitude;
        //     marker.longitude = results[i].longitude;
        //     marker.key = `${results[i].id}`;
        //     arrayMarkers.push(marker);
        //   }
        // }
        // console.log('markers------>', arrayMarkers);
        // if (arrayMarkers.length == 0) {
        //   setTimeout(() => {
        //     Common.Alert.show('no_record_found');
        //   }, 2000);
        // }
        // this.setState({ markers: arrayMarkers });
        // this.setState({ arrayEstates: results });
      }
    } else {
      let estateRes = await Services.EstateServices.defaultEstates({
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        zoom: this.page,
      });
      if (estateRes.data) {
        console.log('Listing Response', estateRes.data);
        this.showProperties(estateRes.data);
      }
    }
  }
  handleLoadMore = () => {
    if (this.state.loadMore == true && this.state.isList == true) {
      this.page = this.page + 5; // increase page by 1
      console.log('next----->', this.page);
      this.showItems(this.page);
    }
  };

  onClosePicker() {
    this.setState({
      showPicker: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: wp('100%'),
            height: hp('21%'),
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp('100%'),
              height: hp('5%'),
              marginTop: hp('4.5%'),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{ marginRight: wp('3%') }}
              onPress={() => {
                this.state.isList == true
                  ? this.setState({
                    selectedFilter: this.state.sortActive
                      ? this.state.selectedFilter
                      : null,
                    showPicker: false,
                    showBottomPicker: !this.state.showBottomPicker,
                  })
                  : null;
              }}>
              {this.state.isList == true ? (
                <Image source={Constants.Images.sort} />
              ) : null}
            </TouchableOpacity>

            <View
              style={{
                width: this.state.isList == true ? wp('83%') : wp('93%'),
                height: hp('4%'),
                backgroundColor: '#F3F3F3',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  width: this.state.isList == true ? wp('72%') : wp('78%'),
                  height: hp('3.5%'),
                  paddingVertical: 0,
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.2%'),
                  textAlign: 'right',
                }}
                onChangeText={(text) => this.setState({ searchKeyword: text })}
                value={this.state.searchKeyword}
                placeholder={Common.Translations.translate('looking_for')}
                blurOnSubmit
                onSubmitEditing={({ nativeEvent }) => this.searchResults()}
              />
              <Image
                style={{
                  marginLeft: wp('2%'),
                }}
                source={Constants.Images.searchIcon}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: hp('1.5%'),
              width: wp('100%'),
              height: hp('4%'),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isList: !this.state.isList, showInfo: false });
                setTimeout(() => {
                  this.setState({ loadMore: this.state.isList });
                }, 1000);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  width: wp('30%'),
                  height: hp('4%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3'),
                  }}>
                  {Common.Translations.translate(
                    this.state.isList == true ? 'map' : 'list',
                  )}
                </Text>
                <Image
                  style={{
                    marginLeft: wp('2%'),
                  }}
                  source={
                    this.state.isList == true
                      ? Constants.Images.map
                      : Constants.Images.list
                  }
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: 1,
                height: hp('3%'),
                backgroundColor: '#F3F3F3',
                marginHorizontal: wp('6%'),
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isFilterEvent: true,
                  loadMore: false,
                  searchKeyword: '',
                });
                this.props.navigation.push(
                  Constants.Navigations.Dashboard.FILTER,
                );
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  width: wp('30%'),
                  height: hp('4%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3'),
                  }}>
                  {Common.Translations.translate('filter')}
                </Text>
                <Image
                  style={{
                    marginLeft: wp('2%'),
                  }}
                  source={Constants.Images.filter}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: hp('1%'),
              width: wp('90%'),
              height: hp('4%'),
              backgroundColor: 'white',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isFilter: true,
                  showPicker: !this.state.showPicker,
                  sortActive: false,
                  showBottomPicker: false,
                  showInfo: false,
                })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  width: wp('30%'),
                  height: hp('4%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: wp('1%'),
                  borderWidth: 1,
                  borderColor:
                    this.state.isFilter == true ? '#006FEB' : 'transparent',
                  overflow: 'hidden',
                }}>
                <Image
                  style={{
                    marginRight: wp('6%'),
                  }}
                  source={
                    this.state.isFilter == true
                      ? Constants.Images.downArrowDark
                      : Constants.Images.downArrow
                  }
                />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3%'),
                    color: this.state.isFilter == true ? 'black' : '#E1E1E1',
                  }}>
                  {this.state.selectedFilter == null
                    ? Common.Translations.translate('all')
                    : this.state.selectedFilter.name == undefined
                      ? Common.Translations.translate('all')
                      : this.state.selectedFilter.name}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
            // onPress={() =>
            //   this.setState({isFilter: false, showPicker: false})
            // }
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: wp('30%'),
                  height: hp('4%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: wp('1%'),
                  borderWidth: 0,
                  overflow: 'hidden',
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3'),
                    color: '#E1E1E1',
                  }}>
                  {this.state.markers.length}{' '}
                  {Common.Translations.translate('alone')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: hp('70%'), width: wp('100%') }}>
          {this.state.isList == true ? this.listView() : this.mapView()}
          {this.state.isList == false ? (
            <TouchableOpacity
              style={{
                width: wp('10%'),
                height: wp('10%'),
                position: 'absolute',
                zIndex: 1,
                right: wp('2%'),
                bottom: wp('3%'),
              }}
              onPress={() => {
                this.refreshPageToHome()
              }
              }>
              <Image source={Constants.Images.map_home} />
            </TouchableOpacity>
          ) : null}
        </View>

        {this.state.showInfo && (
          <Components.AmlakInfoView
            markerInfo={this.state.markerInfo}
            onClick={() => {
              this.setState({
                showInfo: false,
                showPicker: false,
                sortActive: false,
                markerInfo: null,
              });
              // if (Constants.API.Token == null) {
              //   this.loginAlert();
              //   return;
              // }
              this.props.navigation.navigate(
                Constants.Navigations.Dashboard.DETAIL,
                { id: this.state.markerInfo.product.id },
              );
            }}
            containerStyle={{
              position: 'absolute',
              bottom: hp('2%'),
              borderRadius: 10,
              overflow: 'hidden',
            }}
          />
        )}

        {this.state.showPicker && (
          <Components.AmlakDropDown
            title={''}
            reload={this.state.selectedFilter == null ? true : true}
            item={
              this.state.selectedFilter == null
                ? { id: 0, name: Common.Translations.translate('all') }
                : this.state.selectedFilter
            }
            listData={this.state.items}
            onSelectOption={(option) =>
              this.setState({
                selectedFilter: option,
                showPicker: false,
                sortActive: false,
              })
            }
            closePicker={() => this.onClosePicker()}
            onCross={() =>
              this.setState({
                selectedFilter: null,
                showPicker: false,
                sortActive: false,
              })
            }
            selectedQuestion={[]}
            containerStyle={{
              top: Common.Helper.isAndroid() ? hp('17%') : hp('20.5%'),
              marginVertical: wp('1%'),
            }}
          />
        )}
        {this.state.showBottomPicker && (
          <Components.AmlakDropDown
            title={''}
            showBottomPicker={true}
            reload={this.state.selectedFilter == null ? true : true}
            item={this.state.selectedFilter}
            listData={this.state.sortOptions}
            onSelectOption={(option) => {
              this.setState({
                selectedFilter: option.id,
                showPicker: false,
                sortActive: true,
              });
              setTimeout(() => {
                this.setState({ showBottomPicker: false });
              }, 1000);
            }}
            onCross={() => this.setState({ showBottomPicker: false })}
            closePicker={() => this.setState({ showBottomPicker: false })}
            selectedQuestion={[]}
            containerStyle={{
              top: null,
              bottom: 0,
              backgroundColor: 'white',
            }}
          />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
