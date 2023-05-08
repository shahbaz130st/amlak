import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import moment from "moment";
import { EventRegister } from "react-native-event-listeners";
import { connect } from "react-redux";
import { Actions } from "../../redux/index";
import * as Components from "../../components/index";
import * as Constants from "../../constants/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";
import User from "../../models/user";
import messaging from "@react-native-firebase/messaging";
import AvatarComponent from "../../components/AvatarComponent";
import ModalDropdown from "../../../lib/react-native-modal-dropdown-with-flatlist";

const dataShops = [
  {
    id: 1,
    name: "Apar. for Rent.",
  },
  {
    id: 2,
    name: "Apar. for Sale.",
  },
  {
    id: 3,
    name: "Land for Sale.",
  },
  {
    id: 4,
    name: "Shop for Rent",
  },
  {
    id: 5,
    name: "Home for Sale",
  },
  {
    id: 6,
    name: "Home for Rent ",
  },
  {
    id: 7,
    name: "Warehouse for Sale ",
  },
  {
    id: 8,
    name: "Warehouse for Rent",
  },
  {
    id: 9,
    name: "Shop for Sale",
  },
  {
    id: 10,
    name: "All",
  },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.page = 10;
    this.state = {
      itemtoggle: false,
      showInfo: false,
      isList: true,
      isFilter: true,
      selectedFilter: null,
      showPicker: false,
      showBottomPicker: false,
      showFooterLoader: false,
      searchKeyword: "",
      arrayEstates: [],
      items: [],
      propertyCount: 0,
      initialPageToRender: 1,
      markers: [],
      markerInfo: {},
      sortActive: false,
      sortOptions: [
        { name: Common.Translations.translate("sortBy"), id: "0" },
        // {name: Common.Translations.translate('popular'), id: '1'},
        { name: Common.Translations.translate("Price_low"), id: "2" },
        { name: Common.Translations.translate("Price_high"), id: "3" },
        {
          name: Common.Translations.translate("distace_circumference"),
          id: "4",
        },
        { name: Common.Translations.translate("rating_one"), id: "5" },
        { name: Common.Translations.translate("rating_five"), id: "6" },
      ],
      refreshing: false,
      currentLocation: {
        latitude: 31.7683, //32.2211,
        longitude: 35.2137, //35.2544
      },
      loadMore: false,
      isFilterEvent: false,
      isShowLocation: false,
      forceRefresh: "333",
      dataFromFilter: false,
      flagAdded: 0,
      city_id: null,
      showBlueColor: false,
    };
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  async componentDidMount() {
    this.cityList();
    // console.log();
    let tempArray = [];
    this.props.toggleLoader(true);
    let token = await Common.KeyChain.get("authToken");
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
            let allDict = { id: 0, name: Common.Translations.translate("all") };
            let array = [allDict, ...userInstance.getUser().categories];
            let tempArray = array.shift();
            var duplicated = array
              .map(function (item) {
                let tempItem = { ...item };
                let tempItem2 = { ...item };
                tempItem.type = Common.Translations.translate("sale");
                tempItem.headerName =
                  Common.Translations.translate("item_type_sale");
                tempItem2.headerName =
                  Common.Translations.translate("item_type_rent");
                tempItem2.type = Common.Translations.translate("rent");
                return [tempItem, tempItem2];
              })
              .reduce(function (a, b) {
                return a.concat(b);
              });
            duplicated.unshift(tempArray);
            this.setState({ items: duplicated });
          }

          // Common.Helper.logEvent("dashboard", {
          //   user: userInstance.getUser().info.name,
          // });

          let eventResponse = await Services.UserServices.eventLogAPI({
            customer_name: userInstance.getUser().info.name
              ? userInstance.getUser().info.name
              : "",
            event_name: "dashboard",
          });
          console.log("Event log API response", eventResponse);
        }
      } catch (error) {}
    } else {
      let values = await Services.EstateServices.categories();
      if (values && values.length > 0) {
        let allDict = { id: 0, name: Common.Translations.translate("all") };
        let array = [allDict, ...values];
        let tempArray = array.shift();
        var duplicated = array
          .map(function (item) {
            let tempItem = { ...item };
            let tempItem2 = { ...item };
            tempItem.type = Common.Translations.translate("sale");
            tempItem.headerName =
              Common.Translations.translate("item_type_sale");
            tempItem2.headerName =
              Common.Translations.translate("item_type_rent");
            tempItem2.type = Common.Translations.translate("rent");
            return [tempItem, tempItem2];
          })
          .reduce(function (a, b) {
            return a.concat(b);
          });
        duplicated.unshift(tempArray);
        this.setState({ items: duplicated });
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
    } catch (error) {}
    this.showItems(this.state.initialPageToRender);
    this.configureListener();
    this.checkPermission();
  }

  cityList = async () => {
    let values = await Services.EstateServices.cityList();
    console.log(values);
    let items = [];
    let city = [];
    for (let i = 0; i < values.length; i++) {
      items.push(
        Constants.API.Language == "en" ? values[i].name : values[i].name_ar
      );
      city.push(values[i]);
    }
    this.setState({ cityItems: items, city: city });
  };

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
        this.showItems(this.state.initialPageToRender);
      }
    } catch (error) {
      // console.log('error', error);
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
      // console.log('Authorization status:', authStatus);
      this.getToken();
    }
  }

  showItems = async (size) => {
    let estateRes = await Services.EstateServices.defaultEstates({
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      zoom: 10 /* size */,
      page: size,
      city_id: this.state.city_id,
    });
    // console.log('response=======estateRes.data.data', JSON.stringify(estateRes.data.data))
    this.setState({ propertyCount: estateRes?.proparty_count });
    this.props.toggleLoader(false);
    this.setState({ showFooterLoader: false });
    if (estateRes.data.data) {
      this.showProperties(estateRes.data.data, true);
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
      (v, i, a) => a.indexOf(v) === i
    );
    this.setState({ markers: uniqueMarkers });
  }

  showProperties(estateRes, add) {
    // console.log("properties", add, estateRes.length)
    if (add) {
      this.setState({
        arrayEstates: [...this.state.arrayEstates, ...estateRes],
      }); //another array
    } else {
      this.setState({ arrayEstates: estateRes });
    }
    let uniqueEstates = this.state.arrayEstates.filter(
      (v, i, a) => a.indexOf(v) === i
    );
    this.setState({ arrayEstates: uniqueEstates });
    // this.renderMarkers(estateRes, add);
    this.renderMarkers(uniqueEstates, add);
  }

  configureListener() {
    this.listener = EventRegister.addEventListener(
      "filterProperties",
      (data) => {
        this.onEndReachedCalledDuringMomentum = true;
        // console.log("datalength", data)
        this.setState({
          isFilterEvent: true,
          loadMore: false,
          dataFromFilter: true,
        });
        this.showProperties(data);
        setTimeout(() => {
          this.setState({ isFilterEvent: false });
        }, 2000);
      }
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
                  width: wp("90%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: wp("6%"),
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.floor_number == undefined
                      ? ""
                      : item?.details?.floor_number +
                        " " +
                        Common.Translations.translate("bathRoom")}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.door_type == undefined
                      ? ""
                      : Constants.API.Language == "ar"
                      ? item?.details?.door_type_arabic
                      : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp("3%"), height: wp("3.5%") }}
                    source={Constants.Images.door}
                  />
                </View>
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.office_area == undefined
                      ? ""
                      : item?.details?.office_area +
                        " " +
                        Common.Translations.translate("m2")}
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
                  width: wp("90%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: wp("6%"),
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.land_type == undefined
                      ? ""
                      : Constants.API.Language == "ar"
                      ? item?.details?.land_type_arabic
                      : item?.details?.land_type}
                  </Text>
                  <Image source={Constants.Images.typeBlack} />
                </View>
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.land_area == undefined
                      ? ""
                      : item?.details?.land_area +
                        " " +
                        " " +
                        Common.Translations.translate("m2")}
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
                  width: wp("90%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: wp("6%"),
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.no_of_bath == undefined
                      ? ""
                      : item?.details?.no_of_bath +
                        " " +
                        Common.Translations.translate("bathRoom")}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.door_type == undefined
                      ? ""
                      : Constants.API.Language == "ar"
                      ? item?.details?.door_type_arabic
                      : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp("3%"), height: wp("3.5%") }}
                    source={Constants.Images.door}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.warehouse_street_width == undefined
                      ? ""
                      : item?.details?.warehouse_street_width +
                        " " +
                        Common.Translations.translate("m")}
                  </Text>
                  <Image
                    style={{ width: wp("3%"), height: wp("3.5%") }}
                    source={Constants.Images.road}
                  />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.warehouse_area == undefined
                      ? ""
                      : item?.details?.warehouse_area +
                        " " +
                        Common.Translations.translate("m2")}
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
                  width: wp("90%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: wp("6%"),
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {Constants.API.Language == "ar"
                      ? item?.details?.door_type_arabic
                      : item?.details?.door_type}
                  </Text>
                  {Constants.API.Language == "ar" &&
                  item?.details?.door_type_arabic ? (
                    <Image
                      style={{ width: wp("3%"), height: wp("3.5%") }}
                      source={Constants.Images.door}
                    />
                  ) : item?.details?.door_type ? (
                    <Image
                      style={{ width: wp("3%"), height: wp("3.5%") }}
                      source={Constants.Images.door}
                    />
                  ) : null}
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
                    {item?.details?.shop_street_width +
                      ' ' +
                      Common.Translations.translate('m')}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.road}
                  />
                </View> */}

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.bath == undefined
                      ? ""
                      : "1" + Common.Translations.translate("bathRoom")}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.shop_area == undefined
                      ? ""
                      : item?.details?.shop_area +
                        " " +
                        Common.Translations.translate("m2")}
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
                  width: wp("90%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: wp("6%"),
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.number_of_baths == undefined
                      ? ""
                      : item?.details?.number_of_baths +
                        " " +
                        Common.Translations.translate("bathRoom")}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.number_of_bedrooms == undefined
                      ? ""
                      : item?.details?.number_of_bedrooms +
                        " " +
                        Common.Translations.translate("bedRoom")}
                  </Text>
                  <Image source={Constants.Images.bed} />
                </View>

                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.number_of_halls == undefined
                      ? ""
                      : item?.details?.number_of_halls +
                        " " +
                        Common.Translations.translate("galleries")}
                  </Text>
                  <Image source={Constants.Images.tub} />
                </View>
                <View
                  style={{
                    marginRight: wp("2%"),
                    height: hp("2%"),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                      marginRight: wp("2%"),
                    }}
                  >
                    {item?.details?.total_area == undefined
                      ? ""
                      : item?.details?.total_area +
                        " " +
                        Common.Translations.translate("m2")}
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
    Alert.alert("", Common.Translations.translate("login_required"), [
      {
        text: Common.Translations.translate("ok"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: Common.Translations.translate("login"),
        onPress: () => {
          setTimeout(() => {
            this.props.navigation.navigate(
              Constants.Navigations.Onboarding.LOGIN
            );
          }, 1000);
        },
        style: "cancel",
      },
    ]);

  renderItem = (value, index) => {
    const { selectedFilter } = this.state;
    const defaultSource =
      itemName == "land"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.landSale
          : Constants.Images.landRent
        : itemName == "shop"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.shopSale
          : Constants.Images.shopRent
        : itemName == "apartment"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.appartmentSale
          : Constants.Images.appartmentRent
        : itemName == "office"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.officeSale
          : Constants.Images.officeRent
        : itemName == "Vialla / Home"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.homeSale
          : Constants.Images.homeRent
        : itemName == "warehouse"
        ? selectedFilter !== null && selectedFilter?.type == "Sale"
          ? Constants.Images.wareHouseSale
          : Constants.Images.wareHouseRent
        : selectedFilter !== null && selectedFilter?.type == "Sale"
        ? Constants.Images.buildingSale
        : Constants.Images.buildingRent;
    const itemName = value?.item?.category_name;
    let Image_Http_URL =
      value.item.picture.length > 0
        ? // ? Constants.API.ImageBaseURL(value.item.picture[0].picture)
          value.item.picture[0].picture
        : // : Constants.Images.cover;
          defaultSource;
    return (
      <View
        style={{
          width: wp("100%"),
          // backgroundColor: "green",
          justifyContent: "center",
          alignItems: "center",
          // marginVertical: wp("2%"),
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            // if (Constants.API.Token == null) {
            //   this.loginAlert();
            //   return;
            // }
            if (Constants.API.Token == null) {
              // Common.Helper.logEvent("Dashboard_List_Property_Click", {
              //   Customer_ID: "With_out_login",
              //   Propert_Id: value.item.id,
              // });

              let eventResponse = await Services.UserServices.eventLogAPI({
                customer_id: "",
                event_name: "Dashboard_List_Property_Click",
                property_id: value.item.id ? value.item.id : "",
                vistor: "visitor",
              });
              console.log("Event log API response", eventResponse);
            } else {
              let userInstance = await User.getInstance();

              // Common.Helper.logEvent("Dashboard_List_Property_Click", {
              //   Customer_ID: userInstance.getUser().info.id,
              //   Propert_Id: value.item.id,
              // });

              let eventResponse = await Services.UserServices.eventLogAPI({
                customer_id: userInstance.getUser().info.id
                  ? userInstance.getUser().info.id
                  : "",
                property_id: value.item.id ? value.item.id : "",
                event_name: "Dashboard_List_Property_Click",
              });
              console.log("Event log API response", eventResponse);
            }
            this.props.navigation.navigate(
              Constants.Navigations.Dashboard.DETAIL,
              { id: value.item.id }
            );
          }}
        >
          <View
            style={{
              width: wp("90%"),
              justifyContent: "center",
              alignItems: "center",
              marginVertical: wp("2%"),
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <View
              style={{
                width: wp("90%"),
                minHeight: hp("23%"),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderRadius: 5,
              }}
            >
              <AvatarComponent
                size={"large"}
                disabled={true}
                // defaultSource={Constants.Images.cover}
                defaultSource={defaultSource}
                source={Image_Http_URL}
                style={{
                  width: wp("90%"),
                  height: hp("23%"),
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                imageStyle={{
                  width: wp("80%"),
                  height: hp("23%"),

                  resizeMode: "contain",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#444040",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: wp("4%"),
                  paddingVertical: wp("0.5%"),
                  right: wp("7%"),
                  top: wp("2%"),
                  borderRadius: wp("1.2%"),
                }}
              >
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp("3%"),
                    color: "white",
                    marginTop: 2,
                  }}
                >
                  {Common.Helper.capitalize(
                    Common.Translations.translate(value.item.sale_or_rent)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                // marginVertical: wp("2%"),
                width: wp("90%"),
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "white",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              <View
                style={{
                  width: wp("85%"),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#B9B9B9",
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp("3%"),
                  }}
                >
                  {moment(value.item.property_announcement_date).format(
                    "DD/MM/YYYY"
                  )}
                </Text>
                <Text
                  style={{
                    color: "#006FEB",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("3.5%"),
                  }}
                >
                  {`${Common.Helper.sign(value.item.currancy)}` +
                    value.item.price}
                </Text>
              </View>

              <View
                style={{
                  width: wp("90%"),
                  flexDirection: "column",
                  justifyContent: "center",
                  marginVertical: wp("1%"),
                }}
              >
                {/* <Text
                  style={{
                    color: "#444040",
                    width: wp("80%"),
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("3"),
                    backgroundColor: "orange",
                    marginLeft: 20,
                  }}
                >
                  {value.item.category_name +
                    " " +
                    Common.Helper.capitalize(
                      Common.Translations.translate(value.item.sale_or_rent)
                    )}
                </Text> */}
                <Text style={{ marginLeft: 20 }}>
                  {this.renderProerties(value.item)}
                </Text>
              </View>
              <View
                style={{
                  width: wp("90%"),
                  height: hp("3%"),
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingRight: wp("3%"),
                }}
              >
                <Text
                  style={{
                    color: "#444040",
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp("2.5%"),
                    marginRight: wp("2%"),
                  }}
                >
                  {`${value.item.region} ${value.item.address} ${
                    Constants.API.Language == "en"
                      ? value.item.city_id
                      : value.item.city_id_arabic
                  }
                    `}
                </Text>

                <Image source={Constants.Images.locationBlack} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            padding: wp("3%"),
            backgroundColor: "rgba(255,255,255,0.56)",
            width: wp("10%"),
            height: wp("10%"),
            borderRadius: wp("10%") / 2,
            justifyContent: "center",
            alignItems: "center",
            top: wp("2.5%"),
            left: wp("12%"),
          }}
        >
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
        reference={(reff) => (this.mapRef = reff)}
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
        onMapPress={async (e) => {
          if (Constants.API.Token == null) {
            // Common.Helper.logEvent("Dashboard_Map_Property_Click", {
            //   Customer_ID: "With_out_login",
            //   Propert_Id: e.product.id,
            // });
            let eventResponse = await Services.UserServices.eventLogAPI({
              customer_id: "",
              property_id: e.product.id ? e.product.id : "",
              event_name: "Dashboard_Map_Property_Click",
              vistor: "visitor",
            });
            console.log("Event log API response", eventResponse);
          } else {
            let userInstance = await User.getInstance();
            // Common.Helper.logEvent("Dashboard_Map_Property_Click", {
            //   Customer_ID: userInstance.getUser().info.id,
            //   Propert_Id: e.product.id,
            // });
            let eventResponse = await Services.UserServices.eventLogAPI({
              customer_id: userInstance.getUser().info.id
                ? userInstance.getUser().info.id
                : "",
              property_id: e.product.id ? e.product.id : "",
              event_name: "Dashboard_Map_Property_Click",
            });
            console.log("Event log API response", eventResponse);
          }
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
    this.setState({ refreshing: true, dataFromFilter: false });
    let estateRes = await Services.EstateServices.defaultEstates({
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      zoom: 10 /* this.page */,
      page: this.state.initialPageToRender,
      city_id: this.state.city_id,
    });
    this.props.toggleLoader(false);
    this.setState({ refreshing: false });
    if (estateRes.data.data) {
      // console.log('Listing Response', estateRes.data);
      this.showProperties(estateRes.data.data);
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
          height: hp("70%"),
          backgroundColor: "#e8e9f3",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {
          console.log("arraylist", array)
        } */}
        {array.length == 0 && this.props.loading !== true ? (
          <Text
            style={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("5%"),
            }}
          >
            {Common.Translations.translate("no_record_found")}
          </Text>
        ) : (
          <FlatList
            data={array}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString() /* `${item.id}` */}
            extraData={this.state.selectedFilter}
            onRefresh={this.refreshList}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={() => {
              if (
                !this.onEndReachedCalledDuringMomentum &&
                !this.state.dataFromFilter
              ) {
                this.setState({ showFooterLoader: true, loadMore: true });
                this.handleLoadMore();
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            ListFooterComponent={
              this.state.showFooterLoader ? (
                <View
                  animationType="slide"
                  style={{
                    margin: 10,
                    padding: 10,
                    alignItems: "center",
                    alignSelf: "center",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    position: "relative",
                    width: "80%",
                  }}
                >
                  <ActivityIndicator size={"large"} color="#007AFF" />
                </View>
              ) : null
            }
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
          (item) => item.product.category_id == this.state.selectedFilter.id
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
        "",
        Common.Translations.translate("no_record_found"),
        [
          {
            text: "OK",
            onPress: () => {
              this.alertPresent = false;
            },
          },
        ],
        { cancelable: false }
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
      case "1":
        break;
      case "2":
        array = array.sort((a, b) => (a.price > b.price ? 1 : -1));
        break;
      case "3":
        array = array.sort((a, b) => (a.price < b.price ? 1 : -1));
        break;
      case "4":
        break;
      case "5":
        array = array.sort((a, b) =>
          a.owner_detail.star_rating > b.owner_detail.star_rating ? 1 : -1
        );
        break;
      case "6":
        array = array.sort((a, b) =>
          a.owner_detail.star_rating < b.owner_detail.star_rating ? 1 : -1
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
      case "1":
        break;
      case "2":
        array = array.sort((a, b) =>
          a.product.price > b.product.price ? 1 : -1
        );
        break;
      case "3":
        array = array.sort((a, b) =>
          a.product.price < b.product.price ? 1 : -1
        );
        break;
      case "4":
        break;
      case "5":
        array = array.sort((a, b) =>
          a.product.owner_detail.star_rating >
          b.product.owner_detail.star_rating
            ? 1
            : -1
        );
        break;
      case "6":
        array = array.sort((a, b) =>
          a.product.owner_detail.star_rating <
          b.product.owner_detail.star_rating
            ? 1
            : -1
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
        this.state.searchKeyword
      );
      // console.log('results', results);
      this.props.toggleLoader(false);
      if (results) {
        this.showProperties(results);
      }
    } else {
      let estateRes = await Services.EstateServices.defaultEstates({
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        zoom: 10 /* this.page */,
        page: this.state.initialPageToRender,
        city_id: this.state.city_id,
      });
      if (estateRes.data.data) {
        // console.log('Listing Response', estateRes?.data?.data?.length);
        this.showProperties(estateRes.data.data);
      }
    }
  }
  handleLoadMore = () => {
    // console.log('i m here');
    // if (this.state.isList == true) {

    // this.page = this.page + 5; // increase page by 1
    this.setState(
      { initialPageToRender: this.state.initialPageToRender + 1 },
      () => {
        this.showItems(this.state.initialPageToRender);
      }
    );

    // }
  };

  onClosePicker() {
    this.setState({
      showPicker: false,
    });
  }

  getFilterList = async (item) => {
    console.log("item", item);

    if (Constants.API.Token == null) {
      let eventResponse = await Services.UserServices.eventLogAPI({
        customer_id: "",
        event_name: `User clicked on ${item?.name + " " + item?.headerName}`,
        vistor: "visitor",
      });
      // console.log(
      //   "User Clicked on, ",
      //   `${item?.name + " " + item?.headerName}`
      // );
      console.log("Event log API response", eventResponse);
    } else {
      let userInstance = await User.getInstance();
      let eventResponse = await Services.UserServices.eventLogAPI({
        customer_id: userInstance.getUser().info.id
          ? userInstance.getUser().info.id
          : "",
        event_name: `User clicked on ${item?.name + " " + item?.headerName}`,
      });
      // console.log(
      //   "User Clicked on, ",
      //   `${item?.name + " " + item?.headerName}`
      // );
      // console.log("Event log API response", eventResponse);
    }

    this.props.toggleLoader(true);
    if (item.id == 0) {
      this.refreshList();
      // this.showItems(1);
    } else {
      const params = {};
      params.rent_or_sale = item?.type.toLowerCase();
      params.type = item?.id;
      params.city_id = this.state.city_id;
      // console.log('parameter request', params);

      let res = await Services.EstateServices.sortList(params);
      console.log("my response filter===>", res);
      this.props.toggleLoader(false);
      if (res?.data) {
        // console.log("res", JSON.stringify(res));
        // this.setState({ arrayEstates: res.data });
        if (res.data.length > 0) {
          Common.KeyChain.save("isFilter", "true");
          EventRegister.emit("filterProperties", res.data);
        } else {
          setTimeout(() => {
            Common.Alert.show("no_result_found");
          }, 1000);
        }
      } else if (res?.status == false) {
        EventRegister.emit("filterProperties", []);
        // this.props.navigation.pop();
        setTimeout(() => {
          Common.Alert.show("no_result_found");
        }, 1000);
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: hp(8),
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "60%",
              alignItems: "center",
              // justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isList: !this.state.isList,
                  showInfo: false,
                  showBlueColor: true,
                });
                setTimeout(() => {
                  this.setState({ loadMore: this.state.isList });
                }, 1000);
              }}
              style={{
                height: 40,
                width: 100,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: this.state.showBlueColor ? "#006feb" : "white",
                // backgroundColor: "pink",
                borderWidth: this.state.showBlueColor ? 0 : 0.5,
                borderColor: "grey",
              }}
            >
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: 13,
                  color: this.state.showBlueColor ? "white" : "black",
                  paddingTop: Constants.API.Language == "ar" ? 4 : 0,
                  // lineHeight: 17,
                }}
              >
                {Common.Translations.translate(
                  this.state.isList == true ? "map" : "list"
                )}
              </Text>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  marginLeft: wp(1),
                  tintColor: this.state.showBlueColor ? "white" : "black",
                }}
                source={
                  this.state.isList == true
                    ? Constants.Images.map
                    : Constants.Images.list
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: 100,
                marginLeft: 10,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "yellow",
                borderWidth: 0.5,
                borderColor: "grey",
              }}
              onPress={() => {
                this.setState({
                  isFilterEvent: true,
                  loadMore: false,
                  searchKeyword: "",
                });
                this.props.navigation.push(
                  Constants.Navigations.Dashboard.FILTER
                );
              }}
            >
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: 13,
                  paddingTop: Constants.API.Language == "ar" ? 4 : 0,
                }}
              >
                {Common.Translations.translate("filter")}
              </Text>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  marginLeft: wp(2),
                  tintColor: "#006feb",
                }}
                source={require("../../assets/images/filterFInal.png")}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: "100%",
              width: "40%",
              // backgroundColor: "green",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <ModalDropdown
              style={{
                backgroundColor: "#F0F0F0",
                // backgroundColor: "red",
                borderRadius: 5,
                marginLeft: 15,
                borderColor: "lightgrey",
                borderWidth: 1,
                justifyContent: "center",
                height: 40,
                width: 100,
              }}
              opacityStyle={{
                height: "100%",
                justifyContent: "center",
              }}
              textStyle={{
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("3%"),
              }}
              dropdownTextStyle={{
                textAlign: "center",
                color: "black",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("3%"),
              }}
              options={this.state.cityItems}
              onSelect={async (idx, value) => {
                console.log(this.state.city[idx].id, value);
                await this.setState({
                  city_id: this.state.city[idx].id,
                });
                this.getFilterList(
                  this.state.selectedFilter == null
                    ? { id: 0, name: "All" }
                    : this.state.selectedFilter
                );
              }}
              leftImage={Constants.Images.menuIcon}
              rightImage={Constants.Images.locationBlack}
              buttonContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
              accessible={true}
              defaultValue={Common.Translations.translate("city")}
            />
          </View>
        </View>
        <View
          style={{
            width: wp("100%"),
            height: hp("7%"),
            backgroundColor: "#e8e9f3",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: hp("5%"),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#e8e9f3",
              // backgroundColor: "red",
            }}
          >
            <TouchableOpacity
              style={{ marginLeft: wp("5%") }}
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
              }}
            >
              {this.state.isList == true ? (
                <View
                  style={{
                    height: 35,
                    width: 35,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image source={Constants.Images.sort} />
                </View>
              ) : null}
            </TouchableOpacity>

            <FlatList
              data={this.state.items}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      selectedFilter: item,
                      flagAdded: index,
                      sortActive: false,
                    });
                    this.getFilterList(item);
                    this.sortList();
                  }}
                  style={
                    this.state.flagAdded === index
                      ? styles.edittchableclicked
                      : styles.edittchable
                  }
                >
                  <Text
                    style={{
                      color:
                        this.state.flagAdded === index
                          ? Constants.Colors.white
                          : // : Constants.Colors.buttonBackground,
                            "black",
                      fontSize: wp("3"),
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.type !== undefined
                      ? `${item.name} ${item?.headerName}`
                      : `${item.name}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          {/* <View
            style={{
              width: wp("100%"),
              height: hp("4%"),
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
            // onPress={() =>
            //   this.setState({isFilter: false, showPicker: false})
            // }
            >
              <View
                style={{
                  paddingLeft: 23,
                  paddingTop: 2,
                  backgroundColor: "red",
                }}
              >
                <Text
                  style={{
                    // fontFamily: Constants.Fonts.shamel,
                    fontSize: wp(3),
                    color: "#E1E1E1",
                  }}
                >
                  {this.state.propertyCount}{" "}
                  {Common.Translations.translate("alone")}
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            /* height: hp('75%'), */ width: wp("100%"),
          }}
        >
          {this.state.isList == true ? this.listView() : this.mapView()}
          {this.state.isList == false ? (
            <TouchableOpacity
              style={{
                width: wp("10%"),
                height: wp("10%"),
                position: "absolute",
                zIndex: 1,
                right: wp("2%"),
                bottom: wp("3%"),
              }}
              onPress={() => {
                this.refreshPageToHome();
              }}
            >
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
                { id: this.state.markerInfo.product.id }
              );
            }}
            containerStyle={{
              position: "absolute",
              bottom: hp("2%"),
              borderRadius: 10,
              overflow: "hidden",
            }}
          />
        )}

        {this.state.showPicker && (
          <Components.AmlakDropDown
            title={""}
            reload={this.state.selectedFilter == null ? true : true}
            item={
              this.state.selectedFilter == null
                ? { id: 0, name: Common.Translations.translate("all") }
                : this.state.selectedFilter
            }
            listData={this.state.items}
            onSelectOption={(option) => {
              // console.log("what is option", option),
              this.setState({
                selectedFilter: option,
                showPicker: false,
                sortActive: false,
              });
            }}
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
              top: Common.Helper.isAndroid() ? hp("17%") : hp("20.5%"),
              marginVertical: wp("1%"),
            }}
          />
        )}
        {this.state.showBottomPicker && (
          <Components.AmlakDropDown
            title={""}
            showBottomPicker={true}
            reload={this.state.selectedFilter == null ? true : true}
            item={this.state.selectedFilter}
            listData={this.state.sortOptions}
            onSelectOption={(option) => {
              // console.log("what is option", option)
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
              backgroundColor: "white",
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});
const mapStateToProps = (state) => {
  return {
    loading: state?.common?.isLoading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  edittchable: {
    height: hp("4%"),
    paddingHorizontal: 15,
    borderRadius: 20,
    // borderWidth: 1,
    borderColor: Constants.Colors.buttonBackground,
    justifyContent: "center",
    marginLeft: 15,
    backgroundColor: "white",
  },

  edittchableclicked: {
    height: hp("4%"),
    paddingHorizontal: 15,
    borderRadius: 20,
    // borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    marginLeft: 15,
    backgroundColor: Constants.Colors.buttonBackground,
  },
});
