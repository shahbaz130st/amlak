import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import * as Components from "../../components/index";
import * as Constants from "../../constants/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";

class First extends Component {
  state = { selected: "sale" };
  render() {
    return (
      <View
        style={[
          {
            width: "100%",
            height: "100%",
            alignItems: "center",
            flexDirection: "column",
          },
          this.props.containerStyle,
        ]}
      >
        <Text> {Common.Translations.translate("propert_type")} </Text>
        <View
          style={{
            flexDirection: "row",
            width: "80%",
            justifyContent: "space-between",
            marginTop: hp("3%"),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ selected: "rent" });
              this.props.propertyAction("rent");
            }}
            style={{
              width: wp("30%"),
              height: wp("30%"),
              borderRadius: wp("30%") / 2,
              backgroundColor:
                this.state.selected == "rent"
                  ? "#006FEB"
                  : "rgba(255, 255, 255, 1)",
              justifyContent: "center",
              alignItems: "center",
              borderColor:
                this.state.selected == "rent"
                  ? "#006FEB"
                  : "rgba(240, 240, 240, 1)",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color:
                  this.state.selected == "rent"
                    ? "rgba(255, 255, 255, 1)"
                    : "black",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("4.5%"),
              }}
            >
              {Common.Translations.translate("for_rent")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ selected: "sale" });
              this.props.propertyAction("sale");
            }}
            style={{
              width: wp("30%"),
              height: wp("30%"),
              borderRadius: wp("30%") / 2,
              backgroundColor:
                this.state.selected == "sale"
                  ? "#006FEB"
                  : "rgba(255, 255, 255, 1)",
              borderColor:
                this.state.selected == "sale"
                  ? "#006FEB"
                  : "rgba(240, 240, 240, 1)",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color:
                  this.state.selected == "sale"
                    ? "rgba(255, 255, 255, 1)"
                    : "black",
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp("4.5%"),
              }}
            >
              {Common.Translations.translate("for_sale")}
            </Text>
          </TouchableOpacity>
        </View>
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

export default First;
