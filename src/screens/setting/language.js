import React, {Component} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';

class Language extends Component {
  state = {selected: Constants.API.Language};

  componentDidMount(){
    Common.Helper.logEvent('language', {
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          title={Common.Translations.translate('language')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={async() => {
              this.setState({selected: 'ar'});
              Constants.API.Language = 'ar'
             await Common.KeyChain.save('Language','ar');
              Common.Translations.initConfig('ar');
            }}
            style={{
              width: '80%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: hp('4%'),
            }}>
            {this.state.selected == 'ar' ? (
              <Image source={Constants.Images.checkSelected} />
            ) : (
              <View />
            )}
            <Text>{Common.Translations.translate('arabic')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async() => {
              this.setState({selected: 'en'});
              Constants.API.Language = 'en';
              await Common.KeyChain.save('Language','en');
              Common.Translations.initConfig('en');
            }}
            style={{
              width: '80%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: hp('4%'),
            }}>
            {this.state.selected == 'en' ? (
              <Image source={Constants.Images.checkSelected} />
            ) : (
              <View />
            )}
            <Text>{Common.Translations.translate('english')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Language;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
});
