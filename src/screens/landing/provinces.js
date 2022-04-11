import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image,StatusBar,
  SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from '../../redux/index';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class Provinces extends Component {
  state = {
    currentLocation: {latitude: 25.2048, longitude: 55.2708},
    markers: [],
    arrayCity: [],
    cityMap: true,
    info: null,
    isShowLocation:false,
    forceRefresh:'333'
  };
  async componentDidMount() {
    try {
      let location = await Common.Helper.location();
      if (location) {
        this.setState({
          currentLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
        this.setState({
          isShowLocation:!this.state.isShowLocation,
          forceRefresh: `${Math.floor(Math.random() * 100)}`
      })
      }
    } catch (error) {}
    this.getCityList();
    Common.Helper.logEvent('provinces', {
    });
  }

  getCityList = async () => {
    this.props.toggleLoader(true);
    let res = await Services.EstateServices.cityList();
    this.props.toggleLoader(false);
    if (res) {
      this.setState({arrayCity: res});
    }
  };

  renderLatitude = () => {
    let latitude = 0.0;
    if (this.state.cityMap == true) {
      latitude =
        this.state.arrayCity.length > 0
          ? parseFloat(this.state.arrayCity[0].latitude)
          : this.state.currentLocation.latitude;
    } else {
      latitude =
        this.state.markers.length > 0
          ? parseFloat(this.state.markers[0].latitude)
          : this.state.currentLocation.latitude;
    }
    return latitude;
  };
  renderLongitude = () => {
    let latitude = 0.0;
    if (this.state.cityMap == true) {
      latitude =
        this.state.arrayCity.length > 0
          ? parseFloat(this.state.arrayCity[0].longitude)
          : this.state.currentLocation.longitude;
    } else {
      latitude =
        this.state.markers.length > 0
          ? parseFloat(this.state.markers[0].longitude)
          : this.state.currentLocation.longitude;
    }
    return latitude;
  };

  propertyByCity = async (city) => {
    this.props.toggleLoader(true);
    this.setState({markers: []});
    let estateRes = await Services.EstateServices.propertyByCity(city.id);
    this.props.toggleLoader(false);
    if (estateRes) {
      this.renderPropertyByCity(estateRes);
    }
  };

  renderPropertyByCity(estateRes, add) {
    let arrayMarkers = [];
    for (let i = 0; i < estateRes.length; i++) {
      let marker = {};
      marker.price =
        `${Common.Helper.sign(estateRes[i].currancy)}` + estateRes[i].price;
      marker.latitude = estateRes[i].latitude;
      marker.longitude = estateRes[i].longitude;
      marker.key = `${estateRes[i].id}`;
      marker.product = estateRes[i];
      arrayMarkers.push(marker);
    }

    if (add) {
      this.setState({markers: [...this.state.markers, ...arrayMarkers]}); //another array
    } else {
      this.setState({markers: arrayMarkers});
    }
    let uniqueMarkers = this.state.markers.filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    this.setState({cityMap: false});
    this.setState({markers: uniqueMarkers});
  }

  render() {
    return (
      <View style={styles.container}>
      <MyStatusBar backgroundColor="white" barStyle="light-content" />
        <Components.AmlakProvincesMap
          provider={1}
          region={{
            latitude: this.renderLatitude(),
            longitude: this.renderLongitude(),
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
          forceRefresh = {this.state.forceRefresh}
        showsUserLocation = {this.state.isShowLocation}
          cityMap={this.state.cityMap}
          markers={
            this.state.cityMap == true
              ? this.state.arrayCity
              : this.state.markers
          }
          onMapPress={(e) => {
            if (this.state.cityMap == true) {
              this.propertyByCity(e);
            } else {
              this.setState({info: e});
            }
          }}
          regionChange={(e) => {}}
        />
        {this.state.cityMap == false && (
          <TouchableOpacity
            onPress={() => {
              this.setState({cityMap: true});
              this.setState({info: null});
            }}
            style={{
              width: wp('10%'),
              height: wp('10%'),
              position: 'absolute',
              right: wp('1%'),
              top: hp('6%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={Constants.Images.closeBig} />
          </TouchableOpacity>
        )}

        {this.state.info && (
          <Components.AmlakInfoView
            markerInfo={this.state.info}
            onClick={() => {
              this.setState({
                info: null,
              });
              this.props.navigation.navigate(
                Constants.Navigations.Dashboard.DETAIL,
                {id: this.state.info.product.id},
              );
            }}
            containerStyle={{
              position: 'absolute',
              bottom: hp('2%'),
              borderRadius: 10,
              overflow: 'hidden',
            }}
          />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Provinces);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
