import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { EventRegister } from "react-native-event-listeners";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import ModalDropdown from "react-native-modal-dropdown-with-flatlist";
import * as Services from "../../services/index";
import User from "../../models/user";
import * as Common from "../../common/index";
import * as Constants from "../../constants/index";
import { Actions } from "../../redux/index";
// import Preference from 'react-native-preference';
class Filter extends Component {
  state = {
    nonCollidingMultiSliderValue:
      /* Preference.get("nonCollidingMultiSliderValue") ? Preference.get("nonCollidingMultiSliderValue") :  */ [
        100, 120000,
      ],
    // spaceValues: [100, 10000],
    spaceValues:
      /* Preference.get("areaSpace") ? Preference.get("areaSpace") : */ [
        0, 10000,
      ],
    roadWidth: [100],
    sliderOneChanging: false,
    items: [],
    currentRating: 0,
    cat_id:
      /* Preference.get("category") ? Preference.get("category")?.id :  */ null,
    sale_rent:
      /* Preference.get("sale_rent") ? Preference.get("sale_rent") : */ null,
    numberOfRooms: 0,
    numberOfHalls: 0,
    numberOfBathRooms: 0,
    priceMax: 120000,
    priceMin: 100,
    floors: "",
    properties: [],
    appliedFilterCount: 1,
    swimming_pool: false,
    maid_room: false,
    varandas: false,
    paved_street: false,
    tabo: false,
    surrounded_wall: false,
    wareHouse_bathroom: false,
    garage: false,
    electricity: false,
    elevator: false,
    water: false,
    landTypes: [
      Common.Translations.translate("living"),
      Common.Translations.translate("agriculture"),
    ],
    land_type:
      /* (Preference.get("land_type") && Preference.get("category") && Preference.get("category")?.id == 30) ? Preference.get("land_type") : */ "",
    categories: [],
    city: [],
    cityItems: [],
    city_id: -1,
  };

  async componentDidMount() {
    this.categroyList();
    this.cityList();

    // Common.Helper.logEvent("filter", {});

    // let eventResponse = await Services.UserServices.eventLogAPI({});
    // console.log("Event log API response", eventResponse);
  }

  resetValues = () => {
    // Preference.clear('category')
    // Preference.clear('sale_rent')
    // Preference.clear("land_type")
    // Preference.clear("nonCollidingMultiSliderValue")
    this.setState({
      nonCollidingMultiSliderValue: [100, 120000],
      spaceValues: [100, 10000],
      roadWidth: [100],
      sliderOneChanging: false,
      currentRating: 0,
      cat_id: null,
      sale_rent: null,
      numberOfRooms: 0,
      numberOfHalls: 0,
      numberOfBathRooms: 0,
      priceMax: 120000,
      priceMin: 100,
      floors: "",
      properties: [],
      appliedFilterCount: 1,
      swimming_pool: false,
      maid_room: false,
      varandas: false,
      paved_street: false,
      tabo: false,
      surrounded_wall: false,
      wareHouse_bathroom: false,
      landTypes: [
        Common.Translations.translate("living"),
        Common.Translations.translate("agriculture"),
      ],
      land_type: "",
    });
  };
  checkAppliedCount = () => {
    this.setState({ appliedFilterCount: 1 });

    if (this.state.currentRating > 1) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.numberOfRooms != 0) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.numberOfBathRooms != 0) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.numberOfHalls != 0) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.floors != "") {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.swimming_pool == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.maid_room == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }

    if (this.state.varandas == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.paved_street == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.tabo == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.surrounded_wall == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
    if (this.state.wareHouse_bathroom == true) {
      this.setState({ appliedFilterCount: this.state.appliedFilterCount + 1 });
    }
  };
  categroyList = async () => {
    let values = await Services.EstateServices.categories();
    let items = [];
    let categories = [];
    for (let i = 0; i < values.length; i++) {
      items.push(values[i].name);
      categories.push(values[i]);
    }
    this.setState({ items: items, categories: categories });
  };
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

  priceRange = async () => {
    if (this.state.cat_id != null && this.state.sale_rent != null) {
      const params = {};
      params.category_id = this.state.cat_id;
      params.rent_or_sale = this.state.sale_rent;
      let res = await Services.EstateServices.priceRange(params);
      console.log("pricerange----->", res);
      if (res && res.max) {
        if (res.max && res.min) {
          // this.setState({priceMax: res.max});
          // this.setState({priceMin: res.min});
          // this.setState({nonCollidingMultiSliderValue:[res.min,res.max]});
        }
      }
    }
  };
  sortList = async () => {
    // floors:LowFloors
    if (this.state.cat_id == null) {
      Common.Alert.show("select_category_type");
      return;
    } else if (this.state.sale_rent == null) {
      Common.Alert.show("select_property_type");
      return;
    }
    this.props.toggleLoader(true);

    const params = {};
    // if (this.state.currentRating > 0) {
    //   params.starts = this.state.currentRating;
    // }

    // if (this.state.varandas == true) {
    //   params.varandas = this.state.varandas;
    // }
    // if (this.state.maid_room == true) {
    //   params.service_room = this.state.maid_room;
    // }

    // if (this.state.swimming_pool == true) {
    //   params.swimming_pool = this.state.swimming_pool;
    // }

    if (this.state.cat_id == 10) {
      if (this.state.numberOfHalls != 0) {
        params.number_of_halls = this.state.numberOfHalls;
      }
      if (this.state.numberOfBathRooms != 0) {
        params.number_of_baths = this.state.numberOfBathRooms;
      }
      if (this.state.numberOfRooms != 0) {
        params.number_of_rooms = this.state.numberOfRooms;
      }
      if (this.state.floors != "") {
        params.floor_level = this.state.floors.toLowerCase();
      }
    }

    if (this.state.cat_id == 20) {
      if (this.state.numberOfHalls != 0) {
        params.number_of_halls = this.state.numberOfHalls;
      }
      if (this.state.numberOfBathRooms != 0) {
        params.number_of_baths = this.state.numberOfBathRooms;
      }

      if (this.state.floors != "") {
        params.floor_number = this.state.floors.toLowerCase();
      }
      params.brenda = this.state.varandas;
      params.service_room = this.state.maid_room;
      params.swimming_pool = this.state.swimming_pool;
    }

    if (this.state.cat_id == 30) {
      params.land_min_area = this.state.spaceValues[0];
      params.land_max_area = this.state.spaceValues[1];
      params.land_type = this.state.land_type;

      if (this.state.tabo == false) {
        params.tapu = "No";
      } else {
        params.tapu = "Yes";
      }

      if (this.state.surrounded_wall == false) {
        params.wall_around = "No";
      } else {
        params.wall_around = "Yes";
      }
    }

    if (this.state.cat_id == 40) {
      params.shop_min_area = this.state.spaceValues[0];
      params.shop_max_area = this.state.spaceValues[1];

      if (this.state.electricity == true) {
        params.bath = this.state.electricity;
      }
      if (this.state.car_garage == true) {
        params.garage = this.state.car_garage;
      }
      if (this.state.elevator == true) {
        params.elevator = this.state.elevator;
      }
    }

    if (this.state.cat_id == 50) {
      params.min_area = this.state.spaceValues[0];
      params.max_area = this.state.spaceValues[1];
      params.no_of_bath = this.state.wareHouse_bathroom == true ? 1 : 0;

      if (this.state.floors != "") {
        params.floor_number = this.state.floors.toLowerCase();
      }

      if (this.state.car_garage == true) {
        params.car_garage = this.state.car_garage;
      }
      if (this.state.elevator == true) {
        params.elevator = this.state.elevator;
      }
    }

    if (this.state.cat_id == 60) {
      if (this.state.electricity == true) {
        params.electricity = this.state.electricity;
      }

      if (this.state.elevator == true) {
        params.elevator = this.state.elevator;
      }

      if (this.state.car_garage == true) {
        params.garage = this.state.car_garage;
      }

      if (this.state.water == true) {
        params.water = this.state.water;
      }
      if (this.state.surrounded_wall == true) {
        params.bath = this.state.surrounded_wall == true ? "yes" : "no";
      }

      params.min_area = this.state.spaceValues[0];
      params.max_area = this.state.spaceValues[1];
      if (this.state.floors != "") {
        params.floor_number = this.state.floors.toLowerCase();
      }
    }

    params.min_price = this.state.nonCollidingMultiSliderValue[0];
    params.max_price = this.state.nonCollidingMultiSliderValue[1];
    // params.category_id = this.state.cat_id;
    params.rent_or_sale = this.state.sale_rent.toLowerCase();
    params.type = this.state.cat_id;
    params.city_id = this.state.city_id;

    console.log("parameter request", params);

    let res = await Services.EstateServices.sortList(params);
    console.log("my response filter===>", res);
    this.props.toggleLoader(false);
    if (res && res.data) {
      console.log("res", res);
      this.setState({ properties: res.data });
      if (res.data.length > 0) {
        Common.KeyChain.save("isFilter", "true");
        EventRegister.emit("filterProperties", res.data);
        setTimeout(() => {
          this.props.navigation.pop();
        }, 2000);
      } else {
        setTimeout(() => {
          Common.Alert.show("no_result_found");
        }, 1000);
      }
    } else if (res.status == false) {
      EventRegister.emit("filterProperties", []);
      this.props.navigation.pop();
      setTimeout(() => {
        Common.Alert.show("no_result_found");
      }, 1000);
    }
  };

  dropdown_landType_onSelect = (idx, value) => {
    let items = this.state.landTypes[idx];
    if (idx == 0) {
      // Preference.set("land_type", 'Building')
      this.setState({ land_type: "Building" });
    }
    if (idx == 1) {
      // Preference.set("land_type", 'Agriculture')
      this.setState({ land_type: "Agriculture" });
    }
  };

  showVillas = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <Text
          style={{
            marginTop: wp("6%"),
            width: "100%",
            color: "#444040",
            textAlign: "right",
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("3%"),
            marginBottom: wp("3%"),
          }}
        >
          {Common.Translations.translate("roleNumber")}
        </Text>
        <View style={{ width: "100%", flexDirection: "column" }}>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ swimming_pool: !this.state.swimming_pool });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.swimming_pool == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("swimming_pool")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ maid_room: !this.state.maid_room });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.maid_room == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("maid_room")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ varandas: !this.state.varandas });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.varandas == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("varandas")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  showLands = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            marginTop: wp("6%"),
          }}
        >
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ tabo: !this.state.tabo });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.tabo == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("tabo")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ surrounded_wall: !this.state.surrounded_wall });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.surrounded_wall == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("surrounded_with_wall")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  showShop = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            marginTop: wp("6%"),
          }}
        >
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ electricity: !this.state.electricity });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.electricity == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("bathRoom")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ garage: !this.state.garage });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.garage == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("garage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ elevator: !this.state.elevator });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.elevator == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("elevator")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  showOffice = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            marginTop: wp("6%"),
          }}
        >
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ electricity: !this.state.electricity });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.electricity == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("electricity")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ garage: !this.state.garage });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.garage == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("garage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ elevator: !this.state.elevator });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.elevator == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("elevator")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ water: !this.state.water });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.water == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("water")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: wp("2%"),
            width: "95%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ surrounded_wall: !this.state.surrounded_wall });
              setTimeout(() => {
                this.checkAppliedCount();
              }, 1000);
            }}
          >
            <Image
              source={
                this.state.surrounded_wall == true
                  ? Constants.Images.filterCheck
                  : Constants.Images.filterUncheck
              }
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("3%"),
              }}
            >
              {Common.Translations.translate("bathRoom")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  showWarehouse = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <Text
          style={{
            marginTop: wp("6%"),
            width: "100%",
            color: "#444040",
            textAlign: "right",
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("3%"),
            marginBottom: wp("3%"),
          }}
        >
          {Common.Translations.translate("roleNumber")}
        </Text>
        <View style={{ width: "100%", flexDirection: "column" }}>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "1" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "1"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("basements")}
              </Text>
              <Text
                style={{
                  marginTop: wp("1%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2%"),
                }}
              >
                {Common.Translations.translate("basementMessage")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "4" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "4"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("mezzanines")}
              </Text>
              <Text
                style={{
                  marginTop: wp("0.3%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("mezzaninesMessage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "10" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "10"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("upperFloors")}
              </Text>
              <Text
                style={{
                  marginTop: wp("0.3%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("upperFloorsMessage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("3%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  wareHouse_bathroom: !this.state.wareHouse_bathroom,
                });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.wareHouse_bathroom == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("numberOfBathRooms")}
              </Text>
              <Text
                style={{
                  marginTop: wp("0.3%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("wareHouse_bathroom")}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ garage: !this.state.garage });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.garage == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("garage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ water: !this.state.water });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.water == true
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("elevator")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  showApartments = () => {
    return (
      <View style={{ width: "90%", flexDirection: "column" }}>
        <Text
          style={{
            marginTop: wp("6%"),
            width: "100%",
            color: "#444040",
            textAlign: "right",
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("3%"),
            marginBottom: wp("3%"),
          }}
        >
          {Common.Translations.translate("roleNumber")}
        </Text>
        <View style={{ width: "100%", flexDirection: "column" }}>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "1" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "1"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("basements")}
              </Text>
              <Text
                style={{
                  marginTop: wp("1%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2%"),
                }}
              >
                {Common.Translations.translate("basementMessage")}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "4" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "4"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("mezzanines")}
              </Text>
              <Text
                style={{
                  marginTop: wp("0.3%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("mezzaninesMessage")}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: wp("2%"),
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ floors: "10" });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
            >
              <Image
                source={
                  this.state.floors == "10"
                    ? Constants.Images.filterCheck
                    : Constants.Images.filterUncheck
                }
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
              >
                {Common.Translations.translate("upperFloors")}
              </Text>
              <Text
                style={{
                  marginTop: wp("0.3%"),
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("upperFloorsMessage")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  showAttachments = () => {
    return (
      <View style={{ width: "100%" }}>
        <Text
          style={{
            marginTop: wp("10%"),
            width: "95%",
            color: "#444040",
            textAlign: "right",
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("3%"),
          }}
        >
          {Common.Translations.translate("attachments")}
        </Text>
        <View
          style={{
            width: "95%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: wp("5%"),
              }}
            >
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfRooms: this.state.numberOfRooms + 1,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.plusIcon} />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3.5%"),
                  marginHorizontal: wp("4%"),
                }}
              >
                {this.state.numberOfRooms == 0 ? "-" : this.state.numberOfRooms}
              </Text>
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfRooms:
                        this.state.numberOfRooms - 1 > 0
                          ? this.state.numberOfRooms - 1
                          : 0,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.minusIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("numberOfRooms")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: wp("2%"),
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: wp("5%"),
              }}
            >
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfHalls: this.state.numberOfHalls + 1,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.plusIcon} />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3.5%"),
                  marginHorizontal: wp("4%"),
                }}
              >
                {this.state.numberOfHalls == 0 ? "-" : this.state.numberOfHalls}
              </Text>
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfHalls:
                        this.state.numberOfHalls - 1 > 0
                          ? this.state.numberOfHalls - 1
                          : 0,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.minusIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("numberOfHalls")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: wp("2%"),
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: wp("5%"),
              }}
            >
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfBathRooms: this.state.numberOfBathRooms + 1,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.plusIcon} />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3.5%"),
                  marginHorizontal: wp("4%"),
                }}
              >
                {this.state.numberOfBathRooms == 0
                  ? "-"
                  : this.state.numberOfBathRooms}
              </Text>
              <View
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  borderWidth: 0.7,
                  borderColor: "rgba(68,68,64,0.76)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      numberOfBathRooms:
                        this.state.numberOfBathRooms - 1 > 0
                          ? this.state.numberOfBathRooms - 1
                          : 0,
                    });
                    setTimeout(() => {
                      this.checkAppliedCount();
                    }, 1000);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={Constants.Images.minusIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("numberOfBathRooms")}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  showRating = () => {
    return (
      <View
        style={{ flexDirection: "column", alignItems: "center", width: "100%" }}
      >
        <Text
          style={{
            marginTop: wp("7%"),
            width: "90%",
            color: "#444040",
            textAlign: "right",
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("3%"),
            marginBottom: wp("2%"),
          }}
        >
          {Common.Translations.translate("evaluation")}
        </Text>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: wp("13%"),
              height: wp("8%"),
              backgroundColor:
                this.state.currentRating == 1 ? "#006FEB" : "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentRating: 1 });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.state.currentRating == 1 ? "white" : "#969696",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("3.5%"),
                  marginRight: wp("1%"),
                  marginTop: wp("1.5%"),
                }}
              >
                1
              </Text>
              <Image
                source={
                  this.state.currentRating == 1
                    ? Constants.Images.starWhite
                    : Constants.Images.starGray
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp("13%"),
              height: wp("8%"),
              backgroundColor:
                this.state.currentRating == 2 ? "#006FEB" : "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentRating: 2 });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.state.currentRating == 2 ? "white" : "#969696",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("3.5%"),
                  marginRight: wp("1%"),
                  marginTop: wp("1.5%"),
                }}
              >
                2
              </Text>
              <Image
                source={
                  this.state.currentRating == 2
                    ? Constants.Images.starWhite
                    : Constants.Images.starGray
                }
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: wp("13%"),
              height: wp("8%"),
              backgroundColor:
                this.state.currentRating == 3 ? "#006FEB" : "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentRating: 3 });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.state.currentRating == 3 ? "white" : "#969696",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("3.5%"),
                  marginRight: wp("1%"),
                  marginTop: wp("1.5%"),
                }}
              >
                3
              </Text>
              <Image
                source={
                  this.state.currentRating == 3
                    ? Constants.Images.starWhite
                    : Constants.Images.starGray
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp("13%"),
              height: wp("8%"),
              backgroundColor:
                this.state.currentRating == 4 ? "#006FEB" : "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentRating: 4 });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.state.currentRating == 4 ? "white" : "#969696",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("3.5%"),
                  marginRight: wp("1%"),
                  marginTop: wp("1.5%"),
                }}
              >
                4
              </Text>
              <Image
                source={
                  this.state.currentRating == 4
                    ? Constants.Images.starWhite
                    : Constants.Images.starGray
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp("13%"),
              height: wp("8%"),
              backgroundColor:
                this.state.currentRating == 5 ? "#006FEB" : "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentRating: 5 });
                setTimeout(() => {
                  this.checkAppliedCount();
                }, 1000);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.state.currentRating == 5 ? "white" : "#969696",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("3.5%"),
                  marginRight: wp("1%"),
                  marginTop: wp("1.5%"),
                }}
              >
                5
              </Text>
              <Image
                source={
                  this.state.currentRating == 5
                    ? Constants.Images.starWhite
                    : Constants.Images.starGray
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  showView = () => {
    switch (this.state.cat_id) {
      case 10:
        return [this.showAttachments(), this.showApartments()];
        break;
      case 20:
        return [this.showAttachments(), this.showVillas()];
        break;
      case 30:
        return [this.showLands()];
        break;
      case 40:
        return [this.showShop()];
        break;
      case 60:
        return [this.showOffice()];
        break;
      case 50:
        return [this.showWarehouse()];
        break;
      default:
        break;
    }
  };

  renderSpaceDropdown = (slideWidth) => {
    switch (this.state.cat_id) {
      case 30:
        return (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: wp("7%"),
                width: "90%",
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("area_scale")}
            </Text>

            <View
              style={{
                width: "90%",
                backgroundColor: "#F0F0F0",
                borderRadius: wp("1%"),
                overflow: "hidden",
                marginTop: wp("2%"),
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MultiSlider
                // containerStyle = {{backgroundColor:'trasparent'}}
                imageBackgroundSource={null}
                trackStyle={{ backgroundColor: "#CDCDCD" }}
                markerStyle={{
                  backgroundColor: "#006FEB",
                  width: wp("5%"),
                  height: wp("5%"),
                }}
                values={[this.state.spaceValues[0], this.state.spaceValues[1]]}
                sliderLength={slideWidth}
                onValuesChange={this.spaceSlideValueChanged}
                min={100}
                max={10000}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={40}
              />
              <View
                style={{
                  width: "89%",
                  height: hp("3%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[0]}
                </Text>
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[1]}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 40:
        return (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: wp("7%"),
                width: "90%",
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("area_scale")}
            </Text>

            <View
              style={{
                width: "90%",
                backgroundColor: "#F0F0F0",
                borderRadius: wp("1%"),
                overflow: "hidden",
                marginTop: wp("2%"),
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MultiSlider
                // containerStyle = {{backgroundColor:'trasparent'}}
                imageBackgroundSource={null}
                trackStyle={{ backgroundColor: "#CDCDCD" }}
                markerStyle={{
                  backgroundColor: "#006FEB",
                  width: wp("5%"),
                  height: wp("5%"),
                }}
                values={[this.state.spaceValues[0], this.state.spaceValues[1]]}
                sliderLength={slideWidth}
                onValuesChange={this.spaceSlideValueChanged}
                min={100}
                max={10000}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={40}
              />
              <View
                style={{
                  width: "89%",
                  height: hp("3%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[0]}
                </Text>
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[1]}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 50:
        return (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: wp("7%"),
                width: "90%",
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("area_scale")}
            </Text>

            <View
              style={{
                width: "90%",
                backgroundColor: "#F0F0F0",
                borderRadius: wp("1%"),
                overflow: "hidden",
                marginTop: wp("2%"),
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MultiSlider
                // containerStyle = {{backgroundColor:'trasparent'}}
                imageBackgroundSource={null}
                trackStyle={{ backgroundColor: "#CDCDCD" }}
                markerStyle={{
                  backgroundColor: "#006FEB",
                  width: wp("5%"),
                  height: wp("5%"),
                }}
                values={[this.state.spaceValues[0], this.state.spaceValues[1]]}
                sliderLength={slideWidth}
                onValuesChange={this.spaceSlideValueChanged}
                min={100}
                max={10000}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={40}
              />
              <View
                style={{
                  width: "89%",
                  height: hp("3%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[0]}
                </Text>
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[1]}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      case 60:
        return (
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: wp("7%"),
                width: "90%",
                color: "#444040",
                textAlign: "right",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("2.5%"),
              }}
            >
              {Common.Translations.translate("area_scale")}
            </Text>

            <View
              style={{
                width: "90%",
                backgroundColor: "#F0F0F0",
                borderRadius: wp("1%"),
                overflow: "hidden",
                marginTop: wp("2%"),
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MultiSlider
                // containerStyle = {{backgroundColor:'trasparent'}}
                imageBackgroundSource={null}
                trackStyle={{ backgroundColor: "#CDCDCD" }}
                markerStyle={{
                  backgroundColor: "#006FEB",
                  width: wp("5%"),
                  height: wp("5%"),
                }}
                values={[this.state.spaceValues[0], this.state.spaceValues[1]]}
                sliderLength={slideWidth}
                onValuesChange={this.spaceSlideValueChanged}
                min={100}
                max={10000}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={40}
              />
              <View
                style={{
                  width: "89%",
                  height: hp("3%"),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[0]}
                </Text>
                <Text
                  style={{
                    color: "#444040",
                    textAlign: "right",
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp("2.5%"),
                  }}
                >
                  m² {this.state.spaceValues[1]}
                </Text>
              </View>
            </View>
          </View>
        );
        break;

      default:
        return null;
        break;
    }
  };
  nonCollidingMultiSliderValuesChange = (values) => {
    // Preference.set("nonCollidingMultiSliderValue", values)
    this.setState({ nonCollidingMultiSliderValue: values });
  };
  spaceSlideValueChanged = (values) => {
    // Preference.set("areaSpace", values)
    this.setState({ spaceValues: values });
  };
  roadWidthSlideValueChanged = (values) => {
    this.setState({ roadWidth: values });
  };

  dropdown_category_onSelect = (idx, value) => {
    let items = this.state.categories[idx];
    // Preference.set("category", items)
    this.setState({ cat_id: items.id });
    setTimeout(() => {
      this.priceRange();
    }, 1000);
  };
  dropdown_propertyType_onSelect = (idx, value) => {
    // Preference.set("sale_rent", value)
    this.setState({ sale_rent: value });
    setTimeout(() => {
      this.priceRange();
    }, 1000);
  };
  render() {
    let slideWidth = Common.Helper.dimensions().width - wp("20%");
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            height: hp("5%"),
            marginTop: hp("4%"),
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.resetValues();
            }}
          >
            <Text
              style={{
                color: "#006FEB",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("3%"),
              }}
            >
              {Common.Translations.translate("reset")}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#444040",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("3.5%"),
            }}
          >
            {Common.Translations.translate("filtering")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop();
            }}
          >
            <Image
              source={Constants.Images.closeIcon}
              style={{
                width: wp("3%"),
                height: wp("3%"),
                marginRight: wp("2%"),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          enableOnAndroid={true}
          contentContainerStyle={styles.mainContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={{
              marginTop: wp("4%"),
              width: "90%",
              color: "#444040",
              textAlign: "right",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("2.5%"),
            }}
          >
            {Common.Translations.translate("filtering")}
          </Text>

          <Text
            style={{
              marginTop: wp("4%"),
              width: "90%",
              color: "#444040",
              textAlign: "right",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("2.5%"),
            }}
          >
            {Common.Translations.translate("category")}
            <Text
              style={{
                color: "red",
                paddingHorizontal: wp("1%"),
                fontSize: wp("3%"),
              }}
            >
              *
            </Text>
          </Text>
          <View
            style={{
              width: "90%",
              backgroundColor: "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: wp("2%"),
              }}
            >
              <Image
                source={Constants.Images.menuIcon}
                style={{
                  width: wp("3%"),
                  height: wp("3%"),
                  marginLeft: wp("3%"),
                }}
                resizeMode="contain"
              />
              <ModalDropdown
                style={{
                  width: "90%",
                }}
                textStyle={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
                dropdownStyle={{ width: "80%" }}
                dropdownTextStyle={{
                  textAlign: "right",
                  color: "black",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                  marginRight: wp("2%"),
                }}
                options={this.state.items}
                onSelect={(idx, value) =>
                  this.dropdown_category_onSelect(idx, value)
                }
                value={this.state.cat_id}
                defaultValue={
                  /* Preference.get("category") ? Preference.get("category")?.name : */ Common.Translations.translate(
                    "category"
                  )
                }
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: wp("4%"),
              width: "90%",
              color: "#444040",
              textAlign: "right",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("2.5%"),
            }}
          >
            {Common.Translations.translate("property_type")}
            <Text
              style={{
                color: "red",
                paddingHorizontal: wp("1%"),
                fontSize: wp("3%"),
              }}
            >
              *
            </Text>
          </Text>
          <View
            style={{
              width: "90%",
              backgroundColor: "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: wp("2%"),
              }}
            >
              <Image
                source={Constants.Images.menuIcon}
                style={{
                  width: wp("3%"),
                  height: wp("3%"),
                  marginLeft: wp("3%"),
                }}
                resizeMode="contain"
              />
              <ModalDropdown
                style={{
                  width: "90%",
                }}
                textStyle={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
                dropdownStyle={{ width: "80%" }}
                dropdownTextStyle={{
                  textAlign: "right",
                  color: "black",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
                options={[
                  Common.Translations.translate("sale"),
                  Common.Translations.translate("rent"),
                ]}
                onSelect={(idx, value) =>
                  this.dropdown_propertyType_onSelect(idx, value)
                }
                defaultValue={
                  /* Preference.get("sale_rent") ? Preference.get("sale_rent") :  */ Common.Translations.translate(
                    "property_type"
                  )
                }
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: wp("4%"),
              width: "90%",
              color: "#444040",
              textAlign: "right",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("2.5%"),
            }}
          >
            {Common.Translations.translate("city")}
          </Text>
          <View
            style={{
              width: "90%",
              backgroundColor: "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
              marginTop: wp("2%"),
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: wp("2%"),
              }}
            >
              <Image
                source={Constants.Images.menuIcon}
                style={{
                  width: wp("3%"),
                  height: wp("3%"),
                  marginLeft: wp("3%"),
                }}
                resizeMode="contain"
              />
              <ModalDropdown
                style={{
                  width: "90%",
                }}
                textStyle={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
                dropdownStyle={{ width: "80%" }}
                dropdownTextStyle={{
                  textAlign: "right",
                  color: "black",
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                }}
                options={this.state.cityItems}
                onSelect={(idx, value) => {
                  console.log(value);
                  this.setState({
                    city_id: this.state.city[idx].id,
                  });
                  // Preference.set("city", value)
                }}
                defaultValue={
                  /* Preference.get("city") ? Preference.get("city") : */ Common.Translations.translate(
                    "city"
                  )
                }
              />
            </TouchableOpacity>
          </View>

          {this.state.cat_id == 30 ? (
            <React.Fragment>
              <Text
                style={{
                  marginTop: wp("4%"),
                  width: "90%",
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("type_land")}
                <Text
                  style={{
                    color: "red",
                    paddingHorizontal: wp("1%"),
                    fontSize: wp("3%"),
                  }}
                >
                  *
                </Text>
              </Text>
              <View
                style={{
                  width: "90%",
                  backgroundColor: "#F0F0F0",
                  borderRadius: wp("1%"),
                  overflow: "hidden",
                  marginTop: wp("2%"),
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: wp("2%"),
                  }}
                >
                  <Image
                    source={Constants.Images.menuIcon}
                    style={{
                      width: wp("3%"),
                      height: wp("3%"),
                      marginLeft: wp("3%"),
                    }}
                    resizeMode="contain"
                  />
                  <ModalDropdown
                    style={{
                      width: "90%",
                    }}
                    textStyle={{
                      color: "#444040",
                      textAlign: "right",
                      fontFamily: Constants.Fonts.shamelBold,
                      fontSize: wp("2.5%"),
                    }}
                    dropdownStyle={{ width: "80%" }}
                    dropdownTextStyle={{
                      textAlign: "right",
                      color: "black",
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp("3%"),
                    }}
                    options={this.state.landTypes}
                    onSelect={(idx, value) =>
                      this.dropdown_landType_onSelect(idx, value)
                    }
                    defaultValue={
                      /* Preference.get("land_type") ? Preference.get("land_type") : */ Common.Translations.translate(
                        "type_land"
                      )
                    }
                  />
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ) : null}

          <Text
            style={{
              marginTop: wp("7%"),
              width: "90%",
              color: "#444040",
              textAlign: "right",
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("2.5%"),
            }}
          >
            {Common.Translations.translate("price")}
          </Text>

          <View
            style={{
              width: "90%",
              backgroundColor: "#F0F0F0",
              borderRadius: wp("1%"),
              overflow: "hidden",
              marginTop: wp("2%"),
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MultiSlider
              // containerStyle = {{backgroundColor:'trasparent'}}
              imageBackgroundSource={null}
              trackStyle={{ backgroundColor: "#CDCDCD" }}
              markerStyle={{
                backgroundColor: "#006FEB",
                width: wp("5%"),
                height: wp("5%"),
              }}
              values={[
                this.state.nonCollidingMultiSliderValue[0],
                this.state.nonCollidingMultiSliderValue[1],
              ]}
              sliderLength={slideWidth}
              onValuesChange={this.nonCollidingMultiSliderValuesChange}
              min={this.state.priceMin}
              max={this.state.priceMax}
              step={1}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={40}
            />
            <View
              style={{
                width: "89%",
                height: hp("3%"),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
              >
                $ {this.state.nonCollidingMultiSliderValue[0]}
              </Text>
              <Text
                style={{
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
              >
                $ {this.state.nonCollidingMultiSliderValue[1]}
              </Text>
            </View>
          </View>
          {this.renderSpaceDropdown(slideWidth)}

          {this.state.cat_id == 50 ? (
            <View
              style={{
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: wp("7%"),
                  width: "90%",
                  color: "#444040",
                  textAlign: "right",
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp("2.5%"),
                }}
              >
                {Common.Translations.translate("road_width")}
              </Text>

              <View
                style={{
                  width: "90%",
                  backgroundColor: "#F0F0F0",
                  borderRadius: wp("1%"),
                  overflow: "hidden",
                  marginTop: wp("2%"),
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MultiSlider
                  trackStyle={{ backgroundColor: "#CDCDCD" }}
                  markerStyle={{
                    backgroundColor: "#006FEB",
                    width: wp("5%"),
                    height: wp("5%"),
                  }}
                  min={10}
                  max={100}
                  step={5}
                  values={this.state.roadWidth}
                  sliderLength={slideWidth}
                  onValuesChange={this.roadWidthSlideValueChanged}
                />
                <View
                  style={{
                    width: "89%",
                    height: hp("3%"),
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#444040",
                      textAlign: "right",
                      fontFamily: Constants.Fonts.shamelBold,
                      fontSize: wp("2.5%"),
                      width: "100%",
                    }}
                  >
                    m² {this.state.roadWidth[0]}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          {/*this.showRating()*/}
          {this.showView()}

          <View />
          <View
            style={{
              width: "90%",
              backgroundColor: Constants.Colors.buttonBackground,
              marginTop: wp("8%"),
              height: hp("5%"),
              overflow: "hidden",
              borderRadius: wp("6%"),
              marginBottom: wp("4%"),
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
              }}
              onPress={() => {
                this.sortList();
              }}
            >
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  color: "white",
                  fontSize: wp("4.0%"),
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {Common.Translations.translate("view_results")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Filter);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    width: Common.Helper.dimensions().width,
    alignItems: "center",
    paddingBottom: wp("2%"),
    // flexGrow: 1,
  },
});
