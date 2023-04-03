import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import * as Components from "../../components/index";
import * as Constants from "../../constants/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";
import User from "../../models/user";

class Second extends Component {
  state = {
    arrayProperty: [],
  };
  componentDidMount() {
    this.categroyList();
  }
  categroyList = () => {
    let userInstance = User.getInstance();
    let categories = [];
    for (let i = 0; i < userInstance.getUser().categories.length; i++) {
      let cat = userInstance.getUser().categories[i];
      cat["selected"] = false;
      categories.push(cat);
    }
    this.setState({ arrayProperty: categories });
  };
  selectItem = (index) => {
    let array = this.state.arrayProperty;
    for (let i = 0; i < array.length; i++) {
      array[i].selected = false;
      if (i == index) {
        array[i].selected = true;
      }
    }
    this.setState({ arrayProperty: array });
    this.props.propertyAction(array[index]);
  };
  renderItem = (value) => {
    return (
      <View
        style={{
          marginVertical: wp("2%"),
          alignItems: "center",
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: 0.2, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          borderRadius: wp("1%"),
          width: "80%",
          paddingHorizontal: wp("3%"),
          borderColor: value.item.selected == true ? "#006FEB" : "transparent",
          borderWidth: value.item.selected == true ? 2 : 0,
        }}
      >
        <TouchableOpacity
          onPress={() => this.selectItem(value.index)}
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            width: wp("88%"),
            paddingVertical: wp("4%"),
          }}
        >
          <Image
            source={
              value.item.selected == true
                ? Constants.Images.filterCheck
                : Constants.Images.filterUncheck
            }
          />
          <Text
            style={{ fontFamily: Constants.Fonts.shamel, fontSize: wp("3.5%") }}
          >
            {Common.Helper.capitalize(value.item.name)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <Text> {Common.Translations.translate("choose_property_type")} </Text>
        <View
          style={{
            width: "100%",
            height: "90%",
            alignItems: "center",
            marginTop: hp("4%"),
          }}
        >
          <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
            data={this.state.arrayProperty}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.name}`}
            extraData={this.state.arrayProperty}
          />
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

export default Second;
