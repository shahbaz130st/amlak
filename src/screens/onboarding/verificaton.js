import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Constants from "../../constants/index";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { Actions } from "../../redux/index";
import * as Components from "../../components/index";
import * as Common from "../../common/index";
import * as Services from "../../services/index";

class Verificaton extends PureComponent {
  state = {
    keys: [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", 11],
    ],
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
    currentField: 1,
    timer: 60,
    isResendActive: false,
    showResendButton: false,
    showError: false,
  };

  componentDidMount() {
    this.startTimer();
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }

  startTimer = () => {
    this.setState({ showResendButton: true });
    this._interval = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });
      if (this.state.timer == 0) {
        clearInterval(this._interval);
        this.setState({ isResendActive: true });
      }
    }, 1000);
  };
  clicked = (key) => {
    if (key == "11") {
      this.setState({ showError: false });
      if (this.state.digit6 != "") {
        this.setState({ digit6: "" });
        this.setState({ currentField: 5 });
      } else if (this.state.digit5 != "") {
        this.setState({ digit5: "" });
        this.setState({ currentField: 4 });
      } else if (this.state.digit4 != "") {
        this.setState({ digit4: "" });
        this.setState({ currentField: 3 });
      } else if (this.state.digit3 != "") {
        this.setState({ digit3: "" });
        this.setState({ currentField: 2 });
      } else if (this.state.digit2 != "") {
        this.setState({ digit2: "" });
        this.setState({ currentField: 1 });
      } else {
        this.setState({ digit1: "" });
        this.setState({ currentField: 1 });
      }
    } else {
      if (this.state.digit1 == "") {
        this.setState({ digit1: key });
        this.setState({ currentField: 2 });
      } else if (this.state.digit2 == "") {
        this.setState({ digit2: key });
        this.setState({ currentField: 3 });
      } else if (this.state.digit3 == "") {
        this.setState({ digit3: key });
        this.setState({ currentField: 4 });
      } else if (this.state.digit4 == "") {
        this.setState({ digit4: key });
        this.setState({ currentField: 5 });
      } else if (this.state.digit5 == "") {
        this.setState({ digit5: key });
        this.setState({ currentField: 6 });
      } else if (this.state.digit6 == "") {
        this.setState({ digit6: key });
        this.setState({ currentField: 6 });
        setTimeout(() => {
          this.verifiyUser();
        }, 1000);
      }
    }
  };

  resendVerificationCode = async () => {
    this.props.toggleLoader(true);
    let login = await Services.AuthServices.userLogin({
      mobile: this.props.route.params.data.mobile,
    });
    this.props.toggleLoader(false);
    if (login) {
      this.setState({ timer: 60 });
      this.startTimer();
    }
  };

  verifiyUser = async () => {
    // Common.Helper.logEvent('verification', {
    //   phone: this.props.route.params.data.mobile,
    // });
    let eventResponse = await Services.UserServices.eventLogAPI({
      customer_phone: this.props.route.params.data.mobile,
      event_name: "verification",
    });
    if (
      this.state.digit1 != "" &&
      this.state.digit2 != "" &&
      this.state.digit3 != "" &&
      this.state.digit4 != "" &&
      this.state.digit5 != "" &&
      this.state.digit6 != ""
    ) {
      let params = {};
      params.code =
        this.state.digit1 +
        this.state.digit2 +
        this.state.digit3 +
        this.state.digit4 +
        this.state.digit5 +
        this.state.digit6;
      params.mobile = this.props.route.params.data.mobile;
      params.user_id = this.props.route.params.data.id;
      this.props.toggleLoader(true);
      let response = await Services.AuthServices.verifyUser(params);
      this.props.toggleLoader(false);
      if (response.access_token) {
        console.log("token", response.access_token);
        if (Constants.API.FirebaseToken) {
          await Services.UserServices.deviceinfo(Constants.API.FirebaseToken);
        }
        await Services.AuthServices.updateLocation();
        if (this.props.propertyDetailId !== "") {
          this.props.navigation.reset({
            index: 0,
            routes: [
              {
                name: Constants.Navigations.Dashboard.DETAIL,
                params: { id: this.props.propertyDetailId },
              },
            ],
          });
        } else {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: Constants.Navigations.Onboarding.DASHBOARD }],
          });
          this.props.navigation.navigate(
            Constants.Navigations.Onboarding.DASHBOARD
          );
        }
      } else if (response.message) {
        this.setState({ showError: true });
        // setTimeout(function () {
        //   Common.Alert.show('alert', response.message);
        // }, 2000);
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "right",
            width: wp("80%"),
            marginBottom: hp("2%"),
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp("5.3%"),
          }}
        >
          {" "}
          {Common.Translations.translate("verificationTitle")}{" "}
        </Text>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp("3%"),
              width: wp("70%"),
              textAlign: "right",
              color: Constants.Colors.black,
              marginBottom: hp("2%"),
            }}
          >
            {" "}
            {Common.Translations.translate("verificationSubTitle")}{" "}
          </Text>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp("4%"),
              width: wp("80%"),
              textAlign: "right",
              color: Constants.Colors.buttonBackground,
            }}
          >
            {this.props.route.params.data.mobile}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            height: hp("5%"),
            marginTop: hp("3%"),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit1}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 1
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: wp("3%"),
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit2}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 2
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: wp("3%"),
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit3}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 3
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: wp("3%"),
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit4}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 4
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: wp("3%"),
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit5}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 5
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginLeft: wp("3%"),
              }}
            >
              <Text
                style={{
                  width: wp("10%"),
                  height: hp("2.5%"),
                  textAlign: "center",
                  fontSize: wp("3.3%"),
                  fontFamily: Constants.Fonts.shamel,
                }}
              >
                {this.state.digit6}
              </Text>
              {this.state.showError == false ? (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor:
                      this.state.currentField == 6
                        ? Constants.Colors.buttonBackground
                        : "rgb(228,228,228)",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 1,
                    width: wp("10%"),
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>
          </View>

          {this.state.showError && (
            <Text
              style={{
                marginTop: wp("2%"),
                color: "red",
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp("2.5"),
              }}
            >
              {Common.Translations.translate("errorVerificationCode")}
            </Text>
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: hp("5%"),
          }}
        >
          {this.state.keys.map((keys, index) => {
            return (
              <View
                key={index}
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: hp("6%"),
                  width: "70%",
                  marginBottom: hp("2%"),
                  flexDirection: "row",
                }}
              >
                {keys.map((k, i) => {
                  return k == "" ? (
                    <View key={i} style={{ width: wp("20%") }} />
                  ) : (
                    <Components.AmlakKey
                      containerStyles={{ backgroundColor: "rgb(206,228,255)" }}
                      titleStyles={{
                        color: Constants.Colors.buttonBackground,
                        fontFamily: Constants.Fonts.shamelBold,
                      }}
                      image={Constants.Images.backSpace}
                      title={k}
                      key={i}
                      onClick={(key) => {
                        this.clicked(key);
                      }}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
        <View
          style={{
            width: "80%",
            height: hp("5%"),
            marginTop: hp("3%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.showResendButton == true ? (
            this.state.isResendActive == false ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    marginLeft: 5,
                    color: Constants.Colors.buttonBackground,
                    fontSize: hp("2%"),
                    fontFamily: Constants.Fonts.shamelBold,
                  }}
                >
                  00 :{" "}
                  {this.state.timer < 10
                    ? `0${this.state.timer}`
                    : this.state.timer}
                </Text>
                <Text
                  style={{
                    fontSize: wp("3.3%"),
                    fontFamily: Constants.Fonts.shamel,
                    marginLeft: wp("3%"),
                  }}
                >
                  {Common.Translations.translate("codeNotRecieved")}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isResendActive: false });
                    this.setState({ digit1: "" });
                    this.setState({ digit2: "" });
                    this.setState({ digit3: "" });
                    this.setState({ digit4: "" });
                    this.setState({ currentField: 1 });
                    this.resendVerificationCode();
                  }}
                >
                  <Text>{Common.Translations.translate("resendCode")}</Text>
                </TouchableOpacity>
              </View>
            )
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  propertyDetailId: state.common.propertyDetailId,
});

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Verificaton);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
  },
});
