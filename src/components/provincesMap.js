import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

import MapView, {
  Marker,
  Callout,
  ProviderPropType,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import CustomCallout from './customCallout';
import * as Constants from '../constants/index';

const AmlakProvincesMap = (props) => (
  <MapView
    provider={props.provider == null ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
    style={styles.map}
    initialRegion={props.region}
    key={props.forceRefresh ? props.forceRefresh : '33'}
    followsUserLocation={true}
    // zoomEnabled={true}
    // onRegionChange={this.onRegionChange.bind(this)}
    // pitchEnabled={true}
    // showsCompass={true}
    // liteMode={true}
    // showsTraffic={true}
    showsUserLocation={true}
    onRegionChange={props.regionChange}

  // showsIndoors={true}
  // onPress={(e) => props.onMapPress(e)}
  >
    {props.cityMap == true
      ? props.markers.map((marker) => (
        <Marker
          key={`${marker.id}`}
          // image = {Constants.Images.pin}
          coordinate={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude),
          }}
          onPress={() => props.onMapPress(marker)}
          onSelect={() => {
            props.onMapPress(marker);
          }}
          pinColor={'transparent'}>
          <View style={styles.pinCircle}>
            <Text style={styles.pinTextCircle}>
              {Constants.API.Language == 'ar' ? marker.name_ar : marker.name}
            </Text>
          </View>
        </Marker>
      ))
      : props.markers.map((marker) => (
        <Marker
          key={marker.key}
          // image = {Constants.Images.pin}
          coordinate={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude),
          }}
          onPress={() => props.onMapPress(marker)}
          onSelect={() => {
            props.onMapPress(marker);
          }}
          pinColor={Constants.Colors.buttonBackground}>
          {/* <View style={styles.circle}>
              <Image style={styles.pinImage} source={Constants.Images.pin} />
              <Text style={styles.pinText}>{marker.price}</Text>
            </View> */}
          <Callout>
            <View style={styles.circle}>
              <Image style={styles.pinImage} source={Constants.Images.pin} />
              <Text style={styles.pinText}>{marker.price}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
  </MapView>
);

export default AmlakProvincesMap;

AmlakProvincesMap.propTypes = {
  regionChange: PropTypes.func,
  markers: PropTypes.array,
};

AmlakProvincesMap.defaultProps = {
  regionChange: () => { },
  markers: [],
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.Colors.buttonBackground,
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('15%') / 2,
    borderWidth: 3,
    borderColor: 'white',
    // width: 30,
    // height: 30,
    // borderRadius: 30 / 2,
    // backgroundColor: 'red',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 30,
    // height: 30,
    // borderRadius: 30 / 2,
    // backgroundColor: 'red',
  },
  pinTextCircle: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp('2.8%'),
    fontFamily: Constants.Fonts.shamelBold,
  },

  pinText: {
    color: 'black',
    textAlign: 'center',
    position: 'absolute',
    fontSize: wp('4.8%'),
    top: wp('2.5%'),
    fontFamily: Constants.Fonts.shamelBold,
  },

  pinImage: {
    width: wp('30%'),
    height: wp('13%'),
    tintColor: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});
