import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';

class Setting extends Component {
  state = {isEnabled: false};

  toggleSwitch = () => {
    this.setState({isEnabled: !this.state.isEnabled});
  };
componentDidMount(){
  Common.Helper.logEvent('setting', {
  });
}
  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          title={Common.Translations.translate('settings')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        />
        <View
          style={{flexDirection: 'column', marginTop: wp('3%'), width: '85%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: hp('5%'),
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push(
                  Constants.Navigations.Setting.LANGUAGE
                );
              }}
              style={{flexDirection: 'row'}}>
              <Image source={Constants.Images.arrowDetail} />
              <Text style={{color: '#C7C1C1', marginLeft: 3}}>
                {Constants.API.Language == 'ar' ? Common.Translations.translate('arabic'):Common.Translations.translate('english')}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3%'),
                color: '#444040',
              }}>
              {Common.Translations.translate('language')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp('3%'),
              width: '90%',
              height: hp('5%'),
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#4CD964'}}
              thumbColor={'#FDFDFD'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch}
              value={this.state.isEnabled}
            />
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                fontSize: wp('3%'),
                color: '#444040',
              }}>
              {Common.Translations.translate('notification')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
