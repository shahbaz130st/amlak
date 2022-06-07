import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Alert,
  Platform,
  Linking,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SliderBox } from 'react-native-image-slider-box';
import moment from 'moment';
import StarRating from 'react-native-star-rating';
import Share from 'react-native-share';

import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReadMore from 'react-native-read-more-text';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';
import User from '../../models/user';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class EstateDetail extends Component {
  state = {
    propertyDetail: {},
    images: [],
    currentIndex: 1,
    favorite_list: [],
    sortOptions: [
      { name: Common.Translations.translate('report_reason'), id: '-1' },
      { name: Common.Translations.translate('misleading'), id: '1' },
      { name: Common.Translations.translate('fake'), id: '2' },
      { name: Common.Translations.translate('improper'), id: '3' },
      { name: Common.Translations.translate('others'), id: '4' },
    ],
    showReport: false,
    selectedFilter: null,
    reportList: [],
    isLiked: false,
    similerAds: [],
    propertyRegion: null,
    marker: null,
    forceRefresh: '333',
    isShowLocation: false,
    shortLink: ''
  };

  async componentDidMount() {
    this.props.restorePropertyId('');
    this.props.toggleLoader(true);
    let detailRes = await Services.EstateServices.estates(
      this.props.route.params.id,
    );
    let detailAds = await Services.EstateServices.similarProps(
      this.props.route.params.id,
    );
    if (detailAds && detailAds.length > 0) {
      this.setState({ similerAds: detailAds });
    }
    this.props.toggleLoader(false);
    if (detailRes && detailRes.id) {
      this.setState({ propertyDetail: detailRes });
      console.log("Property Detail", detailRes);
      this.setState({
        marker: [{
          latitude:
            parseFloat(detailRes.latitude) == NaN
              ? detailRes.latitude
              : parseFloat(detailRes.latitude),
          longitude:
            parseFloat(detailRes.longitude) == NaN
              ? detailRes.longitude
              : parseFloat(detailRes.longitude),
          title: detailRes.advertiser_name,
          subtitle: '',
        }]
      });
      this.setState({
        propertyRegion: {
          latitude:
            parseFloat(detailRes.latitude) == NaN
              ? detailRes.latitude
              : parseFloat(detailRes.latitude),
          longitude:
            parseFloat(detailRes.longitude) == NaN
              ? detailRes.longitude
              : parseFloat(detailRes.longitude),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
      });

      this.setState({
        forceRefresh: `${Math.floor(Math.random() * 100)}`,
        isShowLocation: !this.state.isShowLocation,
      });
      this.setState({ isLiked: detailRes.is_fav });
      let images = [];

      for (let i = 0; i < detailRes.picture.length; i++) {
        let picture = Constants.API.ImageBaseURL(detailRes.picture[i].picture);
        images.push(picture);
      }
      this.setState({ images: images });
    }
    let userInstance = User.getInstance();
    if (
      userInstance.getUser().report_status &&
      userInstance.getUser().report_status.length > 0
    ) {
      let reports = [];
      for (let i = 0; i < userInstance.getUser().report_status.length; i++) {
        if (userInstance.getUser().report_status[i] != null) {
          reports.push(userInstance.getUser().report_status[i]);
        }
      }
      this.setState({ reportList: reports });
    }
  }

  refreshDetail = async (id) => {
    this.props.toggleLoader(true);
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    let detailRes = await Services.EstateServices.estates(id);
    this.props.toggleLoader(false);
    if (detailRes && detailRes.id) {
      console.log('object------>', detailRes);
      this.setState({ propertyDetail: detailRes });
      this.setState({ isLiked: detailRes.is_fav });
      let images = [];

      for (let i = 0; i < detailRes.picture.length; i++) {
        let picture = Constants.API.ImageBaseURL(detailRes.picture[i].picture);
        images.push(picture);
      }
      this.setState({ images: images });
    }
    let userInstance = User.getInstance();
    if (
      userInstance.getUser().report_status &&
      userInstance.getUser().report_status.length > 0
    ) {
      let reports = [];
      for (let i = 0; i < userInstance.getUser().report_status.length; i++) {
        if (userInstance.getUser().report_status[i] != null) {
          reports.push(userInstance.getUser().report_status[i]);
        }
      }
      this.setState({ reportList: reports });
    }
    let detailAds = await Services.EstateServices.similarProps(id);
    if (detailAds && detailAds.length > 0) {
      this.setState({ similerAds: detailAds });
    }
  };
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#006FEB', marginTop: 5 }} onPress={handlePress}>
        {Common.Translations.translate('readMore')}
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#006FEB', marginTop: 5 }} onPress={handlePress}>
        {Common.Translations.translate('readLess')}
      </Text>
    );
  };

  _handleTextReady = () => {
    // ...
  };
  showPageIndexes = this.state.images.map((item, index) => {
    return (
      <View
        style={{
          backgroundColor:
            index + 1 == this.state.currentIndex
              ? 'rgba(0,111,235,1)'
              : 'rgba(255,255,255,0.35)',
          width: 13,
          height: 13,
          borderRadius: 13 / 2,
          marginHorizontal: wp('0.5%'),
        }}
        key={index}
      />
    );
  });

  async actionLike() {
    if (Constants.API.Token == null) {
      this.loginAlert();
      return;
    }
    if (this.state.isLiked) {
      this.props.toggleLoader(true);
      let favRes = await Services.EstateServices.deletefav(
        this.props.route.params.id,
      );
      this.props.toggleLoader(false);

      if (favRes) {
        console.log('----->', favRes);
        this.setState({ isLiked: false });
      }
    } else {
      this.props.toggleLoader(true);
      let detailRes = await Services.EstateServices.addToFav(
        this.props.route.params.id,
      );
      if (detailRes) {
        console.log('----->', detailRes);
        this.setState({ isLiked: true });
      }
      this.props.toggleLoader(false);
    }
  }

  showReport() {
    if (Constants.API.Token == null) {
      this.loginAlert();
      return;
    }
    Alert.alert(
      Common.Translations.translate('title_report'),
      Common.Translations.translate('message_report'),
      [
        {
          text: Common.Translations.translate('report_button'),
          onPress: () => this.selectReport(),
          style: 'default',
        },
        {
          text: Common.Translations.translate('cancel_button'),
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: false },
    );
  }

  selectReport() {
    this.setState({ showReport: true });
    // Alert.alert(
    //   Common.Translations.translate('report_reason'),
    //   '',
    //   [
    //     {
    //       text: Common.Translations.translate('misleading'),
    //       onPress: () => { this.onMisleading }
    //     },
    //     {
    //       text: Common.Translations.translate('fake'),
    //       onPress: () => { this.onFake }
    //     },
    //     {
    //       text: Common.Translations.translate('improper'),
    //       onPress: () => { this.onImproper }
    //     },
    //     {
    //       text: Common.Translations.translate('others'),
    //       onPress: () => { this.onOthers }
    //     },
    //   ],
    //   { cancelable: false },
    // );
  }

  reportEstate = async (comment) => {
    if (comment.id == '-1') {
      return;
    }
    this.props.toggleLoader(true);
    let params = {};
    let userInstance = User.getInstance();
    if (userInstance.getUser().info) {
      params['user_id'] = userInstance.getUser().info.id;
    }
    params['estat_id'] = this.props.route.params.id;
    params['comment'] = comment.name;
    params['value'] = comment.id;
    console.log('params------>', params);
    await Services.EstateServices.report(params);
    this.props.toggleLoader(false);
  };

  onPressRating() {
    this.props.navigation.navigate(Constants.Navigations.Rating.Rating, {
      propertyDetail: this.state.propertyDetail,
    });
  }

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
          this.props.restorePropertyId(this.props.route.params.id)
          setTimeout(() => {
            this.props.navigation.navigate(
              Constants.Navigations.Onboarding.LOGIN,
            );
          }, 1000);
        },
        style: 'cancel',
      },
    ]);

  onCall() {
    if (Constants.API.Token == null) {
      this.loginAlert();
      return;
    }
    let phone = this.state.propertyDetail.owner_number;
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }

    Alert.alert(
      'Call',
      phone.toString(),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            Linking.canOpenURL(phoneNumber)
              .then((supported) => {
                if (!supported) {
                  Alert.alert('Phone number is not available');
                } else {
                  return Linking.openURL(phoneNumber);
                }
              })
              .catch((err) => console.log(err));
          },
        },
      ],
      { cancelable: false },
    );
  }
  renderDetail = () => {
    switch (this.state.propertyDetail.category_id) {
      case 40:
        return (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              paddingVertical: wp('3%'),
              width: '90%',
              justifyContent: 'space-around',
              paddingHorizontal: wp('2%'),
            }}>
            <MyStatusBar backgroundColor="white" barStyle="light-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.bath == undefined
                  ? ''
                  : 1 + ' ' + Common.Translations.translate('bathRoom')}
              </Text>
              <Image source={Constants.Images.bathRoomSelected} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.door_type == undefined
                  ? ''
                  : Constants.API.Language == 'ar' ? this.state.propertyDetail.details.door_type_arabic : this.state.propertyDetail.details.door_type}
              </Text>
              <Image
                style={{ width: wp('3%'), height: wp('3.5%') }}
                source={Constants.Images.doorBlue}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.shop_street_width ==
                  undefined
                  ? ''
                  : this.state.propertyDetail.details.shop_street_width +
                  ' ' +
                  Common.Translations.translate('m')}
              </Text>
              <Image
                style={{ width: wp('3%'), height: wp('3.5%') }}
                source={Constants.Images.roadBlue}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.shop_area == undefined
                  ? ''
                  : this.state.propertyDetail.details.shop_area +
                  ' ' +
                  Common.Translations.translate('m2')}
              </Text>
              <Image source={Constants.Images.provincesSelected} />
            </View>
          </View>
        );
      case 20:
        return (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              paddingVertical: wp('3%'),
              width: '90%',
              justifyContent: 'space-around',
              paddingHorizontal: wp('2%'),
            }}>
            <MyStatusBar backgroundColor="white" barStyle="light-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_baths == undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_baths +
                  ' ' +
                  Common.Translations.translate('bathRoom')}
              </Text>
              <Image source={Constants.Images.bathRoomSelected} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_halls == undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_halls +
                  ' ' +
                  Common.Translations.translate('galleries')}
              </Text>
              <Image source={Constants.Images.tubSelected} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_bedrooms ==
                  undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_bedrooms +
                  ' ' +
                  Common.Translations.translate('bedRoom')}
              </Text>
              <Image source={Constants.Images.bedSelected} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.total_area == undefined
                  ? ''
                  : this.state.propertyDetail.details.total_area +
                  ' ' +
                  Common.Translations.translate('m2')}
              </Text>
              <Image source={Constants.Images.provincesSelected} />
            </View>
          </View>
        );
      case 50:
        return (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              paddingVertical: wp('3%'),
              width: '90%',
              justifyContent: 'space-between',
              paddingHorizontal: wp('2%'),
            }}>
            <MyStatusBar backgroundColor="white" barStyle="light-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.no_of_bath == undefined
                  ? ''
                  : this.state.propertyDetail.details.no_of_bath +
                  ' ' +
                  Common.Translations.translate('bathRoom')}
              </Text>
              <Image source={Constants.Images.bathRoomSelected} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.door_type == undefined
                  ? ''
                  : Constants.API.Language == 'ar' ? this.state.propertyDetail.details.door_type_arabic : this.state.propertyDetail.details.door_type}
              </Text>
              <Image
                style={{ width: wp('3%'), height: wp('3.5%') }}
                source={Constants.Images.doorBlue}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.warehouse_street_width ==
                  undefined
                  ? ''
                  : this.state.propertyDetail.details.warehouse_street_width +
                  ' ' +
                  Common.Translations.translate('m')}
              </Text>
              <Image
                style={{ width: wp('3%'), height: wp('3.5%') }}
                source={Constants.Images.roadBlue}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.warehouse_area == undefined
                  ? ''
                  : this.state.propertyDetail.details.warehouse_area +
                  ' ' +
                  Common.Translations.translate('m2')}
              </Text>
              <Image source={Constants.Images.provincesSelected} />
            </View>
          </View>
        );
      case 60:
        return (
          <React.Fragment>
            {this.state.propertyDetail.details.office_area &&
              this.state.propertyDetail.details.office_area != undefined ? (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#F5F5F5',
                  paddingVertical: wp('3%'),
                  width: '90%',
                  justifyContent: 'space-around',
                  paddingHorizontal: wp('2%'),
                }}>
                <MyStatusBar backgroundColor="white" barStyle="light-content" />
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
                    {this.state.propertyDetail.details.floor_number == undefined
                      ? ''
                      : this.state.propertyDetail.details.floor_number +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathRoomSelected} />
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
                    {this.state.propertyDetail.details.door_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar' ? this.state.propertyDetail.details.door_type_arabic : this.state.propertyDetail.details.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.doorBlue}
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
                    {this.state.propertyDetail.details.office_area == undefined
                      ? ''
                      : this.state.propertyDetail.details.office_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.provincesSelected} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
      case 30:
        return (
          <React.Fragment>
            {this.state.propertyDetail.details.land_area &&
              this.state.propertyDetail.details.land_area != undefined ? (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#F5F5F5',
                  paddingVertical: wp('3%'),
                  width: '90%',
                  justifyContent: 'space-around',
                  paddingHorizontal: wp('2%'),
                }}>
                <MyStatusBar backgroundColor="white" barStyle="light-content" />
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
                    {this.state.propertyDetail.details.land_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar' ? this.state.propertyDetail.details.land_type_arabic : this.state.propertyDetail.details.land_type}
                  </Text>
                  <Image source={Constants.Images.type} />
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
                    {this.state.propertyDetail.details.land_area == undefined
                      ? ''
                      : this.state.propertyDetail.details.land_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.provincesSelected} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
      default:
        return (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F5F5F5',
              paddingVertical: wp('3%'),
              width: '90%',
              justifyContent: 'space-around',
              paddingHorizontal: wp('2%'),
            }}>
            <MyStatusBar backgroundColor="white" barStyle="light-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_baths == undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_baths +
                  ' ' +
                  Common.Translations.translate('bathRoom')}
              </Text>
              <Image source={Constants.Images.bathRoomSelected} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_halls == undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_halls +
                  ' ' +
                  Common.Translations.translate('galleries')}
              </Text>
              <Image source={Constants.Images.tubSelected} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.number_of_bedrooms ==
                  undefined
                  ? ''
                  : this.state.propertyDetail.details.number_of_bedrooms +
                  ' ' +
                  Common.Translations.translate('bedRoom')}
              </Text>
              <Image source={Constants.Images.bedSelected} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('2.5%'),
                  marginRight: wp('2%'),
                }}>
                {this.state.propertyDetail.details.total_area == undefined
                  ? ''
                  : this.state.propertyDetail.details.total_area +
                  ' ' +
                  Common.Translations.translate('m2')}
              </Text>
              <Image source={Constants.Images.provincesSelected} />
            </View>
          </View>
        );
    }
  };

  renderPropertyDetail = () => {
    switch (this.state.propertyDetail.category_id) {
      case 30:
        return (
          <View
            style={{
              width: '90%',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('surrounded_with_wall')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {this.state.propertyDetail.details.wall_around}
                </Text>
              </View>

              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('property_id')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  {this.state.propertyDetail.details.building_number ==
                    undefined
                    ? this.state.propertyDetail.details.id
                    : this.state.propertyDetail.details.building_number}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {this.state.propertyDetail.water}
                </Text>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  {this.state.propertyDetail.elevator}
                </Text>
              </View>
            </View>
          </View>
        );

      case 50:
        return (
          <View
            style={{
              width: '90%',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {this.state.propertyDetail.category_id == 50 ||
                this.state.propertyDetail.category_id == 40 ? (
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      color: '#444040',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Common.Translations.translate('door_type')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamelBold,
                      color: '#006FEB',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Constants.API.Language == 'ar' ? this.state.propertyDetail.details.door_type_arabic : this.state.propertyDetail.details.door_type}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      color: '#444040',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Common.Translations.translate('year_of_construction')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamelBold,
                      color: '#006FEB',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {this.state.propertyDetail.name}
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('property_id')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  {this.state.propertyDetail.details.building_number ==
                    undefined
                    ? this.state.propertyDetail.details.id
                    : this.state.propertyDetail.details.building_number}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {this.state.propertyDetail.furnitarued}
                </Text>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('interface')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  غربية{' '}
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View
            style={{
              width: '90%',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {this.state.propertyDetail.category_id == 50 ||
                this.state.propertyDetail.category_id == 40 ? (
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      color: '#444040',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Common.Translations.translate('door_type')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamelBold,
                      color: '#006FEB',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Constants.API.Language == 'ar' ? this.state.propertyDetail.details.door_type_arabic : this.state.propertyDetail.details.door_type}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamel,
                      color: '#444040',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {Common.Translations.translate('year_of_construction')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Constants.Fonts.shamelBold,
                      color: '#006FEB',
                      fontSize: wp('3%'),
                      textAlign: 'right',
                    }}>
                    {this.state.propertyDetail.name}
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('property_id')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  {this.state.propertyDetail.details.building_number ==
                    undefined
                    ? this.state.propertyDetail.details.id
                    : this.state.propertyDetail.details.building_number}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {this.state.propertyDetail.furnitarued}
                </Text>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {Common.Translations.translate('interface')}
                </Text>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#006FEB',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                    marginLeft: wp('30%'),
                  }}>
                  غربية{' '}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  };
  renderFacilities = () => {
    switch (this.state.propertyDetail.category_id) {
      case 50:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 30:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('officially_registered')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 40:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 20:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.is_furnitarued.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('veranda')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.brenda.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', marginRight: wp('4%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('maids_room')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.service_room.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('internal_staircase')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.internal_staircase.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 10:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.is_furnitarued.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('veranda')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.brenda.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', marginRight: wp('4%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('maids_room')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.service_room.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 60:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('veranda')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.brenda.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', marginRight: wp('4%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );

      case 70:
        return (
          <View
            style={{
              width: '90%',
              flexDirection: 'column',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('garage')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.car_garage.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('elevator')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.elevator.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('furnished')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.is_furnitarued.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: wp('2%'),
              }}>
              <View style={{ flexDirection: 'row', marginRight: wp('6%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('water')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.water.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', marginRight: wp('4%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('electricity')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.electricity.toLowerCase() == 'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', marginRight: wp('4%') }}>
                <Text
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamelBold,
                    color: '#444040',
                    fontSize: wp('3%'),
                  }}>
                  {Common.Translations.translate('internal_staircase')}
                </Text>
                <Image
                  source={
                    this.state.propertyDetail.internal_staircase.toLowerCase() ==
                      'yes'
                      ? Constants.Images.roundCheck
                      : Constants.Images.roundUnCheck
                  }
                />
              </View>
            </View>
          </View>
        );
      default:
        return <View />;
    }
  };
  headerView = () => (
    <View style={{ alignItems: 'center', flexDirection: 'column' }}>
      <View
        style={{
          width: wp('100%'),
          height: hp('32.5%'),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SliderBox
          images={this.state.images}
          sliderBoxHeight={hp('33%')}
          onCurrentImagePressed={(index) =>
            console.log(`image ${index} pressed`)
          }
          currentImageEmitter={(index) =>
            this.setState({ currentIndex: index + 1 })
          }
          dotColor="#006FEB"
          inactiveDotColor="#FFFFFF"
          dotStyle={{
            width: 12,
            height: 12,
            borderRadius: 6,
          }}
        />
        <View
          style={{
            width: '20%',
            height: hp('3%'),
            position: 'absolute',
            backgroundColor: 'rgba(68, 64, 64, 1)',
            left: 4,
            bottom: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp('3%'),
              color: 'white',
              paddingTop: wp('1%'),
            }}>
            {this.state.currentIndex}/{this.state.images.length}
          </Text>
        </View>
        {/* <View
          style={{
            paddingHorizontal:2,
            height: hp('2%'),
            position: 'absolute',
            backgroundColor: 'rgba(68, 64, 64, 1)',
            bottom: 4,
            alignSelf:'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'row'
          }}>
            {this.state.currentIndex && (
              this.showPageIndexes
        )}
        </View> */}
        <View
          style={{
            width: '90%',
            top: wp('10%'),
            paddingVertical: wp('1%'),
            // backgroundColor: 'red',
            position: 'absolute',
            flexDirection: 'row',
          }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.showReport()}>
              <View
                style={{
                  width: wp('10%'),
                  height: wp('10%'),
                  resizeMode: 'cover',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: wp('10%') / 2,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(240,241,243,0.76)',
                }}>
                <Image source={Constants.Images.spam} />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <View
                style={{
                  width: wp('10%'),
                  height: wp('10%'),
                  resizeMode: 'cover',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: wp('10%') / 2,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(240,241,243,0.76)',
                  marginLeft: wp('2%'),
                }}>
                <Image source={Constants.Images.share} />
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => this.actionLike()}>
              <View
                style={{
                  width: wp('10%'),
                  height: wp('10%'),
                  resizeMode: 'cover',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: wp('10%') / 2,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(240,241,243,0.76)',
                  marginLeft: wp('2%'),
                }}>
                <Image
                  source={
                    this.state.isLiked == false
                      ? Constants.Images.heartGray
                      : Constants.Images.heartRed
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp('10%'),
              height: wp('10%'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: wp('10%') / 2,
              overflow: 'hidden',
              backgroundColor: 'rgba(240,241,243,0.76)',
              marginLeft: wp('56%'),
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.pop();
              }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={Constants.Images.rightArrowWhite} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 1,
          flexDirection: 'column',
        }}>
        <View
          style={{
            width: '90%',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              color: '#B9B9B9',
              fontSize: wp('2.5%'),
              marginRight: wp('2%'),
            }}>
            {Constants.API.Language == 'en'
              ? Common.Translations.translate('last_updated_in')
              : moment(this.state.propertyDetail.updated_at).format(
                'DD/MM/YYYY',
              )}
          </Text>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              color: '#B9B9B9',
              fontSize: wp('2.5%'),
            }}>
            {Constants.API.Language == 'en'
              ? moment(this.state.propertyDetail.updated_at).format(
                'DD/MM/YYYY',
              )
              : Common.Translations.translate('last_updated_in')}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
            color: '#006FEB',
            fontSize: wp('4.5%'),
            alignSelf: 'flex-end',
            marginRight: wp('9%'),
          }}>
          {`${Common.Helper.sign(this.state.propertyDetail.currancy)}` +
            this.state.propertyDetail.price}
        </Text>
        <Text
          style={{
            fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
            color: '#444040',
            fontSize: wp('3.5%'),
            alignSelf: 'flex-end',
            marginRight: wp('9%'),
          }}>
          {this.state.propertyDetail.category_name +
            ' ' +

            Common.Helper.capitalize(Common.Translations.translate(this.state.propertyDetail.sale_or_rent))}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: wp('1%'),
            paddingRight: wp('2%'),
            marginBottom: wp('2%'),
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              color: '#444040',
              fontSize: wp('3.5%'),
              marginRight: wp('2%'),
            }}>
            {`${this.state.propertyDetail.region} ${Constants.API.Language == 'ar' ? this.state.propertyDetail.city_id_arabic : this.state.propertyDetail.city_id} ${this.state.propertyDetail.address}`}
          </Text>
          <Image source={Constants.Images.locationBlack} />
        </View>
        {this.renderDetail()}
        <Text
          style={{
            fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
            color: '#444040',
            fontSize: wp('3.5%'),
            marginTop: wp('4%'),
            width: '90%',
            textAlign: 'right',
          }}>
          {Common.Translations.translate('property_description')}
        </Text>
        <View
          style={{
            width: '90%',
            borderBottomColor: '#f5f5f5',
            borderBottomWidth: 1,
            paddingBottom: 5,
          }}>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
            onReady={this._handleTextReady}>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                color: '#444040',
                fontSize: wp('3.5%'),
                textAlign: 'right',
              }}>
              {this.state.propertyDetail.description}
            </Text>
          </ReadMore>
          {/* <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              color: '#006FEB',
              fontSize: wp('3%'),
              textAlign: 'right',
              position: 'absolute',
              top: wp('5.3%'),
              left: wp('30%'),
            }}>
            اقرأ المزيد
          </Text> */}
        </View>
        <Text
          style={{
            fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
            color: '#444040',
            fontSize: wp('3.5%'),
            textAlign: 'right',
            width: '90%',
            marginTop: hp('4%'),
            marginBottom: hp('1%'),
          }}>
          {Common.Translations.translate('property_details')}
        </Text>
        {this.renderPropertyDetail()}
        <Text
          style={{
            fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
            color: '#444040',
            fontSize: wp('3.5%'),
            textAlign: 'right',
            width: '90%',
            marginTop: hp('4%'),
            marginBottom: hp('1%'),
          }}>
          {Common.Translations.translate('comfortable_features')}
        </Text>

        {this.renderFacilities()}
        <View
          style={{
            width: '90%',
            marginTop: hp('4%'),
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
              color: '#444040',
              fontSize: wp('4%'),
              marginBottom: 3,
              textAlign: 'right',
            }}>
            {Common.Translations.translate('advertiser')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.onCall()}
              style={{
                width: wp('10%'),
                height: wp('10%'),
                backgroundColor: '#05B433',
                borderRadius: wp('10%') / 2,
                marginLeft: wp('2%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: wp('5%'),
                  height: wp('5%'),
                }}
                source={Constants.Images.phone}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  // backgroundColor: 'red'
                }}>
                <Text
                  onPress={() => {
                    if (this.state.propertyDetail.owner.user_info.id) {
                      this.props.navigation.push(
                        Constants.Navigations.Setting.PROFILE,
                        { id: this.state.propertyDetail.owner.user_info.id },
                      );
                    }
                  }}
                  style={{
                    marginRight: wp('1%'),
                    fontFamily: Constants.Fonts.shamel,
                    color: '#444040',
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {console.log(
                    'this.state.propertyDetail',
                    this.state.propertyDetail.owner.star_rating,
                  )}
                  {this.state.propertyDetail.advertiser_name}
                </Text>
                <TouchableOpacity
                  onPress={() => this.onPressRating()}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginRight: wp('1%'),
                  }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={wp('4%')}
                    emptyStar={Constants.Images.star}
                    fullStar={Constants.Images.starSelected}
                    rating={this.state.propertyDetail.owner.star_rating}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push(
                    Constants.Navigations.Setting.PROFILE,
                    { id: this.state.propertyDetail.owner.user_info.id },
                  )
                }>
                <Image
                  style={{
                    width: wp('13%'),
                    height: wp('13%'),
                    marginLeft: wp('2%'),
                    borderRadius: wp('13%') / 2,
                  }}
                  source={
                    this.state.propertyDetail.owner.image == ''
                      ? Constants.Images.profile
                      : { uri: this.state.propertyDetail.owner.image }
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '90%',
            marginTop: hp('4%'),
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
              color: '#444040',
              fontSize: wp('4%'),
              marginBottom: 3,
              textAlign: 'right',
            }}>
            {Common.Translations.translate('Marketting')}
          </Text>
          <View
            style={{
            }}>
            <TouchableOpacity
              onPress={() => {
                Share.open({url:this.state.propertyDetail.short_link})
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    err && console.log(err);
                  });
              }}
              style={{
                width: wp('10%'),
                height: wp('10%'),
                backgroundColor: '#05B433',
                borderRadius: wp('10%') / 2,
                marginLeft: wp('2%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: wp('5%'),
                  height: wp('5%'),
                }}
                source={Constants.Images.share}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'column',
                // backgroundColor: 'red'
              }}>
              <Text
                onPress={() => {
                  if (this.state.propertyDetail.owner.user_info.id) {
                    this.props.navigation.push(
                      Constants.Navigations.Setting.PROFILE,
                      { id: this.state.propertyDetail.owner.user_info.id },
                    );
                  }
                }}
                style={{
                  marginRight: wp('1%'),
                  fontFamily: Constants.Fonts.shamel,
                  color: '#444040',
                  fontSize: wp('3%'),
                  marginLeft: wp('4%'),
                  marginTop: 20
                }}>
                {this.state.propertyDetail.short_link}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '90%',
            marginTop: hp('4%'),
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
              color: '#444040',
              fontSize: wp('4%'),
              marginBottom: 3,
              textAlign: 'right',
            }}>
            {Common.Translations.translate('address_of_property')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                color: '#444040',
                fontSize: wp('3%'),
                marginRight: wp('2%'),
              }}>
              {`${this.state.propertyDetail.region} ${Constants.API.Language == 'ar' ? this.state.propertyDetail.city_id_arabic : this.state.propertyDetail.city_id} ${this.state.propertyDetail.address}`}
            </Text>
            <Image source={Constants.Images.locationBlack} />
          </View>
        </View>
        <View
          style={{
            width: '90%',
            height: hp('15%'),
            marginTop: wp('2%'),
          }}>
          {this.state.propertyRegion &&
            (<Components.AmlakMap
              containerStyles={{ width: '100%', height: '100%' }}
              provider={1}
              showsUserLocation={this.state.isShowLocation}
              forceRefresh={this.state.forceRefresh}
              isCurrentLocation={true}
              region={this.state.propertyRegion}
              markers={this.state.marker}
              onMapPress={(e) => {
                // alert(e);
              }}
            />)}

        </View>
      </View>
      <Text
        style={{
          fontFamily: Constants.API.Language == 'en' ? Constants.Fonts.SF_Pro_Text_Bold : Constants.Fonts.shamelBold,
          color: '#444040',
          fontSize: wp('3%'),
          textAlign: 'right',
          width: '90%',
          marginTop: wp('5%'),
        }}>
        {this.state.similerAds.length > 0
          ? Common.Translations.translate('similar_ads')
          : ''}
      </Text>
      {/* <Text
          style={{
            fontFamily: Constants.Fonts.shamelBold,
            color: '#444040',
            fontSize: wp('3%'),
            textAlign: 'right',
            width: '90%',
            marginTop: wp('5%'),
          }}>
          {Common.Translations.translate('similar_ads')}
        </Text> */}
    </View>
  );
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
                      : Constants.API.Language == 'ar' ? item?.details?.door_type_arabic : item?.details?.door_type +
                        ' ' +
                        Common.Translations.translate('door_type')}
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
                      : Constants.API.Language == 'ar' ? item?.details?.land_type_arabic : item?.details?.land_type}
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
                      : item?.details?.land_area + ' '}
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

                {/* <View
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
                        :item?.details?.warehouse_area +
                        ' ' +
                        Common.Translations.translate('galleries')}
                    </Text>
                    <Image source={Constants.Images.tub} />
                  </View> */}
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
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            ) : null}
          </React.Fragment>
        );
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
  renderItem = (value) => {
    let Image_Http_URL = Constants.Images.cover;
    try {
      Image_Http_URL =
        value.item.picture.length > 0
          ? { uri: Constants.API.ImageBaseURL(value.item.picture[0].picture) }
          : Constants.Images.cover;
    } catch (error) {
      return <View />;
    }
    return (
      <View
        style={{
          width: wp('100%'),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: wp('2%'),
        }}>
        <TouchableOpacity onPress={() => this.refreshDetail(value.item.id)}>
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
                backgroundColor: 'white',
              }}>
              <Image
                style={{ width: wp('80%'), height: hp('23%') }}
                source={Image_Http_URL}
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
                  {Common.Helper.capitalize(Common.Translations.translate(value.item.sale_or_rent))}
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
                    Common.Helper.capitalize(Common.Translations.translate(value.item.sale_or_rent))}
                </Text>
                {this.renderProerties(value.item)}
              </View>
              <View
                style={{
                  width: wp('90%'),
                  height: hp('2%'),
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: wp('8%'),
                }}>
                <Text
                  style={{
                    color: '#444040',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                    marginRight: wp('2%'),
                  }}>
                  {`${value.item.region} ${Constants.API.Language == 'ar' ? value.item.city_id_arabic : value.item.city_id} ${value.item.address}`}
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

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <FlatList
            ref={(ref) => (this.flatListRef = ref)}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={this.state.similerAds}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.id}`}
            ListHeaderComponent={
              this.state.propertyDetail.id == undefined ? null : this.headerView
            }
          />
        </View>
        {this.state.showReport && (
          <Components.AmlakReport
            title={''}
            reload={this.state.selectedFilter == null ? true : true}
            item={
              this.state.selectedFilter == null
                ? null
                : this.state.selectedFilter.id
            }
            showBottomPicker={true}
            listData={this.state.sortOptions}
            onSelectOption={(option) => {
              this.setState({
                selectedFilter: option,
                showReport: false,
              });
              setTimeout(() => {
                this.setState({ showReport: false });
              }, 1000);

              this.reportEstate(option);
            }}
            onCross={() => this.setState({ showReport: false })}
            closePicker={() => this.setState({ showReport: false })}
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
  restorePropertyId: (id) => dispatch(Actions.restorePropertyDetail(id)),
});

export default connect(null, mapDispatchToProps)(EstateDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainContainer: {
    width: Common.Helper.dimensions().width,
  },
});
