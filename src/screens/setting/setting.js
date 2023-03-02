import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Actions } from "../../redux/index";
import { connect } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import * as Components from "../../components/index";
import * as Constants from "../../constants/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";

import User from "../../models/user";
let userID;

class Setting extends Component {
  state = {
    isEnabled: false,
    isDisabledUser: true,
  };

  toggleSwitch = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };
  toggleSwitchDisabledUser = (value) => {
    if (value) {
      this.setState({ isDisabledUser: false });
    } else {
      this.disableAlert();
    }
  };
  componentDidMount() {
    let userInstance = User.getInstance();
    if (userInstance.getUser().info) {
      console.log(userInstance.getUser().info);
      userID = userInstance.getUser().info.id;
    }
    Common.Helper.logEvent("setting", {});
  }

  disableAlert = () =>
    Alert.alert("", Common.Translations.translate("deactivateAlertMsg"), [
      {
        text: Common.Translations.translate("no"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: Common.Translations.translate("confirm"),
        onPress: async () => {
          if (userID) {
            let disableUser = await Services.AuthServices.disableUser({
              id: userID,
            });
            console.log("check for disable user=====>", userID, disableUser);
            if (disableUser.status == true) {
              Common.KeyChain.remove("authToken");
              Constants.API.Token = null;

              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: Constants.Navigations.Onboarding.DASHBOARD },
                  ],
                })
              );
              this.setState({ isDisabledUser: !this.state.isDisabledUser });
            }
          } else {
            this.loginAlert();
          }
        },
        style: "cancel",
      },
    ]);
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

  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp("11%")}
          isButtons={true}
          title={Common.Translations.translate("settings")}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        />
        <View
          style={{ flexDirection: "column", marginTop: wp("3%"), width: "85%" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: hp("5%"),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push(
                  Constants.Navigations.Setting.LANGUAGE
                );
              }}
              style={{ flexDirection: "row" }}
            >
              <Image source={Constants.Images.arrowDetail} />
              <Text style={{ color: "#C7C1C1", marginLeft: 3 }}>
                {Constants.API.Language == "ar"
                  ? Common.Translations.translate("arabic")
                  : Common.Translations.translate("english")}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("3%"),
                color: "#444040",
              }}
            >
              {Common.Translations.translate("language")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: wp("3%"),
              width: "90%",
              height: hp("5%"),
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#4CD964" }}
              thumbColor={"#FDFDFD"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch}
              value={this.state.isEnabled}
            />
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("3%"),
                color: "#444040",
              }}
            >
              {Common.Translations.translate("notification")}
            </Text>
          </View>
          {Constants.API.Token != null && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: wp("3%"),
                width: "90%",
                height: hp("5%"),
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#4CD964" }}
                thumbColor={"#FDFDFD"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSwitchDisabledUser}
                value={this.state.isDisabledUser}
              />
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp("3%"),
                  color: "#444040",
                }}
              >
                {Common.Translations.translate("deactivate")}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Setting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
});
