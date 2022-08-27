import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Pressable
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
// import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../constants/colors';

class Second extends Component {
  state = {
    images: ['1'],
    modalVisible: false
  };
  componentDidMount() {
    // let tem = this.state.images;
    // let source = { uri: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'}

    // tem.push({imageURI: source})
    // this.setState({images:tem});
    // this.props.propertyAction(this.state.images);

    // console.log('--->',this.state.images);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  presentImagePicker = () => {
    const options = {
      cropperToolbarTitle: `${Common.Translations.translate('attach_photo')}`,
      multiple: true,
      skipBackup: true,
      path: 'images',
    };

    ImagePicker.openPicker(options).then((response) => {
      this.setModalVisible(!this.state.modalVisible)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        response.map((item, index) => {
          ImageResizer.createResizedImage(item.sourceURL, 700, 700, 'JPEG', 30, 0)
            .then((response) => {
              const source = { uri: response.uri };
              let array = this.state.images;
              array.push({ imageURI: source });
              setTimeout(() => {
                this.setState({ images: array });
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
        })
      }
    });
  };
  openImageCamera = () => {
    const options = {
      cropperToolbarTitle: `${Common.Translations.translate('attach_photo')}`,
      multiple: true,
      skipBackup: true,
      path: 'images',
    };

    ImagePicker.openCamera(options).then((response) => {
      this.setModalVisible(!this.state.modalVisible)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
          ImageResizer.createResizedImage(response.sourceURL, 700, 700, 'JPEG', 30, 0)
            .then((response) => {
              const source = { uri: response.uri };
              let array = this.state.images;
              array.push({ imageURI: source });
              setTimeout(() => {
                this.setState({ images: array });
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
    this.setState({ images: array });
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
              dashStyle={{ backgroundColor: '#006FEB' }}
              style={{
                width: wp('15%'),
                height: 1,
                position: 'absolute',
                top: 0,
              }}
            />
            <Dash
              dashThickness={1}
              dashStyle={{ backgroundColor: '#006FEB' }}
              style={{
                width: wp('15%'),
                height: 1,
                position: 'absolute',
                bottom: 0,
              }}
            />
            <Dash
              dashStyle={{ backgroundColor: '#006FEB' }}
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
              dashStyle={{ backgroundColor: '#006FEB' }}
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
                this.setModalVisible(true)
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
              <Image style={{tintColor: "#FFFFFF"}} source={Constants.Images.closeIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { modalVisible } = this.state;
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
                dashStyle={{ backgroundColor: '#006FEB' }}
                style={{
                  width: wp('89%'),
                  height: 1,
                  position: 'absolute',
                  top: 0,
                }}
              />
              <Dash
                dashThickness={1}
                dashStyle={{ backgroundColor: '#006FEB' }}
                style={{
                  width: wp('89%'),
                  height: 1,
                  position: 'absolute',
                  bottom: 0,
                }}
              />
              <Dash
                dashStyle={{ backgroundColor: '#006FEB' }}
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
                dashStyle={{ backgroundColor: '#006FEB' }}
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
                  this.setModalVisible(true)
                  // this.presentImagePicker();
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
                marginTop: wp('2.5%')
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
            <View style={{ width: wp('89%') }}>
              <FlatList
                style={{ width: wp('88%') }}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button, { backgroundColor: colors.buttonBackground, width: "100%", marginBottom: 20 }]}
                onPress={() => {
                  this.openImageCamera();
                }}
              >
                <Text style={styles.textStyle}>{`${Common.Translations.translate('choose_from_camera')}`}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: colors.buttonBackground, width: "100%", marginBottom: 20 }]}
                onPress={() => {
                    this.presentImagePicker();
                }}
              >
                <Text style={styles.textStyle}>{`${Common.Translations.translate('choose_from_library')}`}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>{`${Common.Translations.translate('cancel')}`}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    width: "100%"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Second;
