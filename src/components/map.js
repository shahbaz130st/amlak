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

import CustomCallout from './customCallout';
import * as Constants from '../constants/index';

const AmlakMap = (props) => {
  return (
    <MapView
    ref={props.reference}
    provider={props.provider == null ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
    style={styles.map}
    initialRegion={props.region}
    key={ props.forceRefresh ?  props.forceRefresh:'33'}
    followsUserLocation={true}
    showsUserLocation={true}

    // zoomEnabled={true}
    // onRegionChange={this.onRegionChange.bind(this)}
    // pitchEnabled={true}
    // showsCompass={true}
    // liteMode={true}
    // showsTraffic={true}
    // showsUserLocation={true}
    // onPanDrag = {props.regionChange}
    onRegionChange={props.regionChange}

    // showsIndoors={true}
    // onPress={(e) => props.onMapPress(e)}
  >
    {props.isCurrentLocation ? (
      <Marker
        coordinate={{
          latitude:  props.markers[0].latitude,
          longitude: props.markers[0].longitude,
        }}
        title={props.markers[0].title}
        description={props.markers[0].description}
      />
    ) : (
      props.markers.map((marker) => (
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
          pinColor={'#006FEB'}>
          
          <Callout>
           <View style={styles.circle}>
            <Image style={styles.pinImage} source={Constants.Images.pin} />
            <Text style={styles.pinText}>{marker.price}</Text>
          </View>
          </Callout>
        </Marker>
      ))
    )}
  </MapView>
  );
}
export default AmlakMap;

AmlakMap.propTypes = {
  regionChange: PropTypes.func,
};

AmlakMap.defaultProps = {
  regionChange: () => {},
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 30,
    // height: 30,
    // borderRadius: 30 / 2,
    // backgroundColor: 'red',
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
    height: wp('10%'),
    tintColor: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});
