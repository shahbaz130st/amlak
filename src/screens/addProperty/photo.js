import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import Dash from 'react-native-dash';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

class Second extends Component {
  state = {
    images: ['1'],
  };
componentDidMount() {
  // let tem = this.state.images;
  // let source = { uri: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'}
  
  // tem.push({imageURI: source})
  // this.setState({images:tem});
  // this.props.propertyAction(this.state.images);

  // console.log('--->',this.state.images);
}
  presentImagePicker = () => {
    const options = {
      title: `${Common.Translations.translate('attach_photo')}`,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        ImageResizer.createResizedImage(response.uri, 700, 700, 'JPEG', 30, 0)
          .then((response) => {
            const source = {uri: response.uri};
            let array = this.state.images;
            array.push({imageURI: source});
            setTimeout(() => {
              this.setState({images: array});
            }, 1000);
            setTimeout(() => {
              this.props.propertyAction(this.state.images);
            }, 1000);
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
          })
          .catch((err) => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
          });
      }
    });
  };
  removeImage(index) {
    let array = [...this.state.images];
    array.splice(index, 1);
    this.setState({images: array});
    setTimeout(() => {
      this.props.propertyAction(this.state.images);
    }, 1000);
  }

  renderItem = (value) => {
    return (
      <View>
        {value.item == '1' ? (
          <View
            style={{
              width: wp('16%'),
              height: wp('16%'),
              marginTop: wp('4%'),
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: wp('6%'),
            }}>
            <Dash
              dashThickness={1}
              dashStyle={{backgroundColor: '#006FEB'}}
              style={{
                width: wp('15%'),
                height: 1,
                position: 'absolute',
                top: 0,
              }}
            />
            <Dash
              dashThickness={1}
              dashStyle={{backgroundColor: '#006FEB'}}
              style={{
                width: wp('15%'),
                height: 1,
                position: 'absolute',
                bottom: 0,
              }}
            />
            <Dash
              dashStyle={{backgroundColor: '#006FEB'}}
              dashThickness={1}
              style={{
                width: 1,
                height: wp('15%'),
                flexDirection: 'column',
                position: 'absolute',
                left: 0,
              }}
            />
            <Dash
              dashStyle={{backgroundColor: '#006FEB'}}
              dashThickness={1}
              style={{
                width: 1,
                height: wp('15%'),
                flexDirection: 'column',
                position: 'absolute',
                right: 0,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.presentImagePicker();
              }}>
              <Image source={Constants.Images.camera} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            key={`${value.item.imageURI}`}
            style={{
              width: wp('16%'),
              height: wp('16%'),
              marginTop: wp('4%'),
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: wp('6%'),
            }}>
            <Image
              style={{
                width: wp('17%'),
                height: wp('17%'),
                borderRadius: wp('2%'),
              }}
              source={value.item.imageURI}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: wp('0.5%'),
                top: wp('0.5%'),
                backgroundColor: '#444040',
                width: wp('5%'),
                height: wp('5%'),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: wp('5%') / 2,
              }}
              onPress={() => {
                this.removeImage(value.index);
              }}>
              <Image source={Constants.Images.closeIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
            fontSize: wp('4.5%'),
          }}>
          {' '}
          {Common.Translations.translate('attach_photo')}{' '}
        </Text>
        {this.state.images.length == 1 ? (
          <View
            style={{
              width: '100%',
              height: '90%',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: wp('90%'),
                height: wp('45%'),
                marginTop: wp('5%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Dash
                dashThickness={1}
                dashStyle={{backgroundColor: '#006FEB'}}
                style={{
                  width: wp('89%'),
                  height: 1,
                  position: 'absolute',
                  top: 0,
                }}
              />
              <Dash
                dashThickness={1}
                dashStyle={{backgroundColor: '#006FEB'}}
                style={{
                  width: wp('89%'),
                  height: 1,
                  position: 'absolute',
                  bottom: 0,
                }}
              />
              <Dash
                dashStyle={{backgroundColor: '#006FEB'}}
                dashThickness={1}
                style={{
                  width: 1,
                  height: wp('44%'),
                  flexDirection: 'column',
                  position: 'absolute',
                  left: 0,
                }}
              />
              <Dash
                dashStyle={{backgroundColor: '#006FEB'}}
                dashThickness={1}
                style={{
                  width: 1,
                  height: wp('44%'),
                  flexDirection: 'column',
                  position: 'absolute',
                  right: 0,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.presentImagePicker();
                }}>
                <Image source={Constants.Images.camera} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                width: '100%',
                paddingLeft: wp('5%'),
                textAlign: 'left',
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('2.2%'),
                color: '#9D9D9D',
                marginTop:wp('2.5%')
              }}>
              {' '}
              {Common.Translations.translate(
                'add_photo_will_increase_visibality',
              )}{' '}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              height: '90%',
              alignItems: 'center',
            }}>
            <View style={{width: wp('89%')}}>
              <FlatList
                style={{width: wp('88%')}}
                contentContainerStyle={{
                  width: wp('88%'),
                  alignItems: 'flex-start',
                }}
                numColumns={4}
                data={this.state.images}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Second;
