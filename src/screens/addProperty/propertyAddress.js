import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapView, {
  Marker,
  Callout,
  ProviderPropType,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';

class PropertyAddress extends Component {
  state = { region: {}, address: {}, latitude: 0.0, longitude: 0.0 };
  async componentDidMount() {
    try {
      let location = await Common.Helper.location();

      if (location) {
        let addres = await Common.Helper.address(
          location.latitude,
          location.longitude,
        );
        this.setState({ address: addres });
        let region = {};
        region['latitude'] = location.latitude;
        region['longitude'] = location.longitude;
        region['latitudeDelta'] = 0.002;
        region['longitudeDelta'] = 0.002;
        this.setState({
          region: region,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        this.props.propertyAction({
          address: this.state.address,
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        });
      }
    } catch (error) { }
  }
  render() {
    return (
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column',
          },
          this.props.containerStyle,
        ]}>
        <Text
          style={{
            width: '100%',
            paddingRight: wp('10%'),
            textAlign: 'right',
            fontFamily: Constants.Fonts.shamelBold,
            fontSize: wp('3.5%'),
          }}>
          {' '}
          {Common.Translations.translate('add_property_address')}{' '}
        </Text>
        <View
          style={{
            width: '100%',
            marginTop: hp('3%'),
            backgroundColor: 'white',
            height: '100%',
          }}>
          {this.state.region.latitude && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={this.state.region}
              // zoomEnabled={true}
              // onRegionChange={this.onRegionChange.bind(this)}
              // pitchEnabled={true}
              // showsCompass={true}
              // liteMode={true}
              // showsTraffic={true}
              // showsIndoors={true}
              showsUserLocation={true}
              onPress={async (e) => {
                let tempRegion = { ... this.state.region }
                let coordinate = e.nativeEvent.coordinate;
                tempRegion.latitude = coordinate.latitude;
                tempRegion.longitude = coordinate.longitude;
                
                this.setState({
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                  region: tempRegion,
                  
                }, async() => {
                  let addres = await Common.Helper.address(
                    coordinate.latitude,
                    coordinate.longitude,
                  );
                  this.setState({address: addres})
                  // this.forceUpdate()
                });
               
                this.props.propertyAction({
                  address: this.state.address,
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                });
              }}
            >
              <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }} />
            </MapView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PropertyAddress;
