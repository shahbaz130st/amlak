import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';

class Help extends Component {
  state = {currentSelected: null};

  renderHelp = () => {
    switch (this.state.currentSelected) {
      case Common.Translations.translate('from_amlak'):
        return (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: wp('3%'),
            }}>
            <Text
              style={{
                width: '90%',
                textAlign: 'center',
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3.5%'),
              }}>
              {' '}
              {Common.Translations.translate('from_amlak_text')}{' '}
            </Text>
          </View>
        );
        break;
      case Common.Translations.translate('common_questions'):
        return (
          <ScrollView>
            <View
              style={{
                flexDirection: 'column',
                marginTop: wp('3%'),
                width: wp('100%'),
              }}>
              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('how_advertise')}{' '}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  paddingVertical: wp('2%'),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    width: wp('90%'),
                    fontSize: wp('3%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('add_get_rejected')}{' '}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  paddingVertical: wp('2%'),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate(
                    'search_specific_property',
                  )}{' '}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    width: wp('90%'),
                    textAlign: 'right',
                    fontSize: wp('3%'),
                  }}>
                  {' '}
                  {Common.Translations.translate('amlak_team')}{' '}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('status_advertisement')}{' '}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('my_property_status')}{' '}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('report_property')}{' '}
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  marginTop: wp('5%'),
                  backgroundColor: 'white',
                  alignItems: 'center',
                  paddingVertical: wp('2%'),
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    width: wp('90%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('in_case_of_property')}{' '}
                </Text>
              </View>
            </View>
          </ScrollView>
        );
        break;
      case Common.Translations.translate('privacy_policy'):
        return (
          <ScrollView>
            <View
              style={{
                width: wp('90%'),
                justifyContent: 'center',
                marginTop: wp('3%'),
                flexDirection: 'column',
              }}>
              {Constants.API.Language == 'ar' ? (
                <Text
                  style={{
                    width: '90%',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3.5%'),
                    paddingHorizontal: wp('1%'),
                    marginBottom: wp('1%'),
                    textAlign: Constants.API.Language == 'ar' ? 'right': 'left',
                  }}>
                  {' '}
                  {Common.Translations.translate('privacy_policy_text')}{' '}
                </Text>
              ) : (
                <React.Fragment>
                  <Text
                    style={{
                      width: '90%',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      paddingHorizontal: wp('1%'),
                      marginBottom: wp('1%'),
                      textAlign: Constants.API.Language == 'ar' ? 'right': 'left',
                    }}>
                    {' '}
                    {Common.Translations.translate('privacy_policy_text')}{' '}
                  </Text>
                  <Text
                    style={{
                      width: '90%',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3.5%'),
                      paddingHorizontal: wp('1%'),
                      textAlign: Constants.API.Language == 'ar' ? 'right': 'left',
                    }}>
                    {' '}
                    {Common.Translations.translate(
                      'privacy_policy_text_2',
                    )}{' '}
                  </Text>
                </React.Fragment>
              )}
            </View>
          </ScrollView>
        );
        break;
      case Common.Translations.translate('payment_methods'):
        return (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: wp('3%'),
            }}>
            <Text
              style={{
                width: '90%',
                textAlign: 'center',
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3.5%'),
              }}>
              {' '}
              {Common.Translations.translate('privacy_policy_text')}{' '}
            </Text>
          </View>
        );
        break;
      default:
        return (
          <View
            style={{
              flexDirection: 'column',
              marginTop: wp('3%'),
              width: '85%',
            }}>
            <View
              style={{
                width: '100%',
                marginTop: wp('5%'),
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: wp('2%'),
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row',width: '100%',justifyContent: 'space-between'}}
                onPress={() => {
                  this.setState({
                    currentSelected:
                      Common.Translations.translate('from_amlak'),
                  });
                }}>
                <Image source={Constants.Images.arrowDetail} />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('from_amlak')}{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: wp('5%'),
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: wp('2%'),
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row',width: '100%',justifyContent: 'space-between'}}
                onPress={() => {
                  this.setState({
                    currentSelected:
                      Common.Translations.translate('common_questions'),
                  });
                }}>
                <Image source={Constants.Images.arrowDetail} />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('common_questions')}{' '}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                marginTop: wp('5%'),
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: wp('2%'),
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row',width: '100%',justifyContent: 'space-between'}}
                onPress={() => {
                  this.setState({
                    currentSelected:
                      Common.Translations.translate('privacy_policy'),
                  });
                }}>
                <Image source={Constants.Images.arrowDetail} />
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('4%'),
                    textAlign: 'right',
                  }}>
                  {' '}
                  {Common.Translations.translate('privacy_policy')}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        break;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          title={
            this.state.currentSelected == null
              ? Common.Translations.translate('help')
              : this.state.currentSelected
          }
          onBackButtonClick={() => {
            this.state.currentSelected == null
              ? this.props.navigation.pop()
              : this.setState({currentSelected: null});
          }}
        />
        {this.renderHelp()}
      </View>
    );
  }
}

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
