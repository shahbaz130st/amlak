import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Platform, Alert } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as Components from "../../components/index";
import * as Constants from "../../constants/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";
import First from "./first";
import Second from "./second";
import Photo from "./photo";
import PropertyAddress from "./propertyAddress";
import PropertInformation from "./propertyInformation";

import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Actions } from "../../redux/index";

class Property extends Component {
  state = {
    currentTab: 1,
    showAddressInformation: false,
    address: "",
    latitude: 31.7683,
    longitude: 35.2137,
    propertyType: null,
    sale_or_rent: "sale",
    images: [],
    params: {},
  };

  showTabs = () => {
    let view;
    switch (this.state.currentTab) {
      case 1:
        view = (
          <First
            type={this.state.sale_or_rent}
            containerStyle={{}}
            propertyAction={(selected) => {
              this.setState({ sale_or_rent: selected });
            }}
          />
        );
        break;
      case 2:
        view = (
          <Second
            containerStyle={{}}
            propertyAction={(selected) => {
              this.setState({ propertyType: selected.id });
            }}
          />
        );
        break;
      case 3:
        view = (
          <Photo
            containerStyle={{}}
            propertyAction={(selected) => {
              this.setState({ images: selected });
            }}
          />
        );
        break;
      case 4:
        view = (
          <PropertyAddress
            containerStyle={{}}
            propertyAction={(selected) => {
              console.log("check my selected addresss=====", selected);
              this.setState({
                address: selected.address,
                latitude: selected.latitude,
                longitude: selected.longitude,
              });
            }}
          />
        );
        break;
      case 5:
        view = (
          <PropertInformation
            category_id={this.state.propertyType}
            containerStyle={{}}
            propertyAction={(selected) => {
              this.create(selected);
            }}
          />
        );
        break;
      default:
        break;
    }
    return view;
  };

  showNextPrevious = (type) => {
    if (type == "next") {
      switch (this.state.currentTab) {
        case 2:
          if (this.state.propertyType == null) {
            Common.Alert.show("select_property_type");
            return;
          }

          break;
        case 3:
          if (
            this.state.images.length <= 1 &&
            this.state.propertyType !== 40 &&
            this.state.propertyType !== 30 &&
            this.state.propertyType !== 10 &&
            this.state.propertyType !== 20 &&
            this.state.propertyType !== 50 &&
            this.state.propertyType !== 60
          ) {
            Common.Alert.show("select_property_images");
            return;
          }
          break;

        default:
          break;
      }
      if (this.state.currentTab != 5) {
        this.setState({ currentTab: this.state.currentTab + 1 });
      }
    } else {
      if (this.state.currentTab != 1) {
        this.setState({ currentTab: this.state.currentTab - 1 });
      }
    }
  };
  createFormData = (photos, body) => {
    const data = new FormData();

    for (let i = 1; i < photos.length; i++) {
      let photo = photos[i].imageURI;
      let filePath =
        Platform.OS === "android"
          ? photo.uri
          : photo.uri.replace("file://", "");
      data.append(`estats_picture_id[${i}]`, {
        name:
          photo.fileName == undefined
            ? `${Math.random().toString(36).substring(7)}.jpg`
            : photo.fileName,
        type: photo.type == undefined ? "image/jpg" : photo.type,
        uri: filePath,
      });
    }

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  create = async (params) => {
    this.props.toggleLoader(true);
    let dataParams = {
      ...params,
      ...this.state.params,
      ...{
        sale_or_rent: this.state.sale_or_rent,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        category_id: this.state.propertyType,
      },
    };
    let formParams = this.createFormData(this.state.images, dataParams);
    console.log(formParams);
    let res = await Services.EstateServices.addEstates(formParams);
    this.props.toggleLoader(false);
    if (res) {
      console.log("property response", res);
      setTimeout(() => {
        Alert.alert(
          Common.Translations.translate("alert"),
          Common.Translations.translate("property_created_successfully"),
          [
            {
              text: Common.Translations.translate("ok"),
              onPress: () => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [
                    { name: Constants.Navigations.Onboarding.DASHBOARD },
                  ],
                });
                this.props.navigation.navigate(
                  Constants.Navigations.Onboarding.DASHBOARD
                );
              },
            },
          ]
        );
      }, 1000);
    }
  };

  render() {
    let title = "";
    switch (this.state.currentTab) {
      case 1:
        title = Common.Translations.translate("category_of_property");
        break;
      case 2:
        title = Common.Translations.translate("choose_property_type");
        break;
      case 3:
        title = Common.Translations.translate("picture_of_property");
        break;
      case 4:
        title = Common.Translations.translate("address_of_property");
        break;
      case 5:
        title = Common.Translations.translate("property_details");
        break;
      default:
        break;
    }
    return (
      <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
        <Components.AmlakHeader
          height={hp("11%")}
          isButtons={true}
          leftButton={Constants.Images.closeBig}
          title={title}
          onSettingClick={() => {
            this.props.navigation.pop();
          }}
          onBackButtonClick={() => {
            {
              this.state.currentTab > 1
                ? this.showNextPrevious("previous")
                : this.props.navigation.pop();
            }
          }}
        />

        <Text
          style={{
            width: "100%",
            textAlign: "right",
            paddingRight: wp("11%"),
            marginTop: wp("4%"),
          }}
        >
          {Common.Translations.translate("property_details")} (%
          {`${20 * this.state.currentTab}`})
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "79%",
            marginTop: wp("3%"),
          }}
        >
          <View
            style={{
              width: wp("13%"),
              height: wp("1%"),
              borderRadius: wp("1%") / 2,
              backgroundColor:
                this.state.currentTab == 5
                  ? "rgba(138, 205, 62, 1)"
                  : "rgba(224, 224, 224, 1)",
            }}
          />
          <View
            style={{
              width: wp("13%"),
              height: wp("1%"),
              borderRadius: wp("1%") / 2,
              backgroundColor:
                this.state.currentTab >= 4
                  ? "rgba(138, 205, 62, 1)"
                  : "rgba(224, 224, 224, 1)",
            }}
          />
          <View
            style={{
              width: wp("13%"),
              height: wp("1%"),
              borderRadius: wp("1%") / 2,
              backgroundColor:
                this.state.currentTab >= 3
                  ? "rgba(138, 205, 62, 1)"
                  : "rgba(224, 224, 224, 1)",
            }}
          />
          <View
            style={{
              width: wp("13%"),
              height: wp("1%"),
              borderRadius: wp("1%") / 2,
              backgroundColor:
                this.state.currentTab >= 2
                  ? "rgba(138, 205, 62, 1)"
                  : "rgba(224, 224, 224, 1)",
            }}
          />
          <View
            style={{
              width: wp("13%"),
              height: wp("1%"),
              borderRadius: wp("1%") / 2,
              backgroundColor:
                this.state.currentTab >= 1
                  ? "rgba(138, 205, 62, 1)"
                  : "rgba(224, 224, 224, 1)",
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: "70%",
            marginTop: wp("10%"),
          }}
        >
          {this.showTabs()}
        </View>
        {this.state.currentTab == 4 ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              position: "absolute",
              bottom: wp("10%"),
            }}
          >
            <Components.AmlakButton
              title={"emphasis"}
              titleStyles={{ color: Constants.Colors.white }}
              containerStyles={{
                backgroundColor: Constants.Colors.buttonBackground,
              }}
              onClick={() => {
                this.setState({ showAddressInformation: true }),
                  this.state.currentTab == 4
                    ? null
                    : this.showNextPrevious("next");
              }}
            />
          </View>
        ) : this.state.currentTab == 5 ? null : (
          <View
            style={{
              width: "100%",
              height: "5%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: wp("10%"),
            }}
          >
            <TouchableOpacity
              onPress={() => this.showNextPrevious("next")}
              style={{
                width: wp("10%"),
                height: wp("10%"),
                borderRadius: wp("10%") / 2,
                backgroundColor: "#006FEB",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={Constants.Images.leftArrowWhite} />
            </TouchableOpacity>
            {this.state.currentTab > 1 ? (
              <TouchableOpacity
                onPress={() => this.showNextPrevious("previous")}
                style={{
                  width: wp("10%"),
                  height: wp("10%"),
                  borderRadius: wp("10%") / 2,
                  backgroundColor: "#006FEB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={Constants.Images.rightArrowWhite} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        )}

        {this.state.showAddressInformation && (
          <Components.AmlakAddressInformation
            address={this.state.address}
            propertyType={this.state.propertyType}
            addressInformation={(values) => {
              this.showNextPrevious("next"),
                this.setState({
                  showAddressInformation: false,
                  params: values,
                });
            }}
            closePicker={() => this.setState({ showAddressInformation: false })}
            containerStyle={{
              top: 0,
              marginVertical: wp("1%"),
              bottom: 0,
              borderTopLeftRadius: wp("5%"),
              borderTopRightRadius: wp("5%"),
              justifyContent: "flex-start",
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Property);
