import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { Translations } from '../common/index';
import * as Constants from '../constants/index';
import * as Common from '../common/index';
import AvatarComponent from "../components/AvatarComponent";

const renderProerties = (item) => {
  switch (item.category_id) {
    case 60:
      return (
        <React.Fragment>
          {item?.details?.office_area &&
            item?.details?.office_area != undefined ? (
            <View
              style={{
                width: wp('48%'),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                  backgroundColor: 'red',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '47%',
                    backgroundColor: 'blue',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.floor_number == undefined
                      ? ''
                      : item?.details?.floor_number +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>

                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                    backgroundColor: 'pink',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.door_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar'
                        ? item?.details?.door_type_arabic
                        : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.office_area == undefined
                      ? ''
                      : item?.details?.office_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            </View>
          ) : null}
        </React.Fragment>
      );
      break;
    case 30:
      return (
        <React.Fragment>
          {item?.details?.land_area && item?.details?.land_area != undefined ? (
            <View
              style={{
                width: wp('48%'),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  marginRight: wp('2%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '45%',
                }}>
                <Text
                  style={{
                    color: '#444040',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('2%'),
                  }}>
                  {item?.details?.land_type == undefined
                    ? ''
                    : Constants.API.Language == 'ar'
                      ? item?.details?.land_type_arabic
                      : item?.details?.land_type}
                </Text>
                <Image source={Constants.Images.typeBlack} />
              </View>
              <View
                style={{
                  marginRight: wp('2%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '45%',
                }}>
                <Text
                  style={{
                    color: '#444040',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    marginRight: wp('2%'),
                  }}>
                  {item?.details?.land_area == undefined
                    ? ''
                    : item?.details?.land_area + ' '}
                </Text>
                <Image source={Constants.Images.expand} />
              </View>
            </View>
          ) : null}
        </React.Fragment>
      );
      break;
    case 50:
      return (
        <React.Fragment>
          {item?.details?.warehouse_area != undefined ? (
            <View
              style={{
                width: wp('48%'),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.no_of_bath == undefined
                      ? ''
                      : item?.details?.no_of_bath +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.door_type == undefined
                      ? ''
                      : Constants.API.Language == 'ar'
                        ? item?.details?.door_type_arabic
                        : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.warehouse_street_width == undefined
                      ? ''
                      : item?.details?.warehouse_street_width +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.road}
                  />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.warehouse_area == undefined
                      ? ''
                      : item?.details?.warehouse_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            </View>
          ) : null}
        </React.Fragment>
      );
      break;
    case 40:
      return (
        <React.Fragment>
          {
            //item?.details?.warehouse_area != undefined ? (
            <View
              style={{
                width: wp('48%'),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {Constants.API.Language == 'ar'
                      ? item?.details?.door_type_arabic
                      : item?.details?.door_type}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.door}
                  />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.shop_street_width +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image
                    style={{ width: wp('3%'), height: wp('3.5%') }}
                    source={Constants.Images.road}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.bath == undefined
                      ? ''
                      : item?.details?.bath +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.shop_area == undefined
                      ? ''
                      : item?.details?.shop_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image
                    style={{ width: 10, height: 10 }}
                    source={Constants.Images.provinces}
                  />
                </View>
              </View>
            </View>
            //) : null
          }
        </React.Fragment>
      );
      break;

    default:
      return (
        <React.Fragment>
          {item?.details?.number_of_baths != undefined ? (
            <View
              style={{
                width: wp('48%'),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '98%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_baths == undefined
                      ? ''
                      : item?.details?.number_of_baths +
                      ' ' +
                      Common.Translations.translate('bathRoom')}
                  </Text>
                  <Image source={Constants.Images.bathroom} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_bedrooms == undefined
                      ? ''
                      : item?.details?.number_of_bedrooms +
                      ' ' +
                      Common.Translations.translate('bedRoom')}
                  </Text>
                  <Image source={Constants.Images.bed} />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '98%',
                  marginTop: wp('1%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.number_of_halls == undefined
                      ? ''
                      : item?.details?.number_of_halls +
                      ' ' +
                      Common.Translations.translate('galleries')}
                  </Text>
                  <Image source={Constants.Images.tub} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '45%',
                  }}>
                  <Text
                    style={{
                      color: '#444040',
                      fontFamily: Constants.Fonts.shamel,
                      fontSize: wp('3%'),
                      marginRight: wp('2%'),
                    }}>
                    {item?.details?.total_area == undefined
                      ? ''
                      : item?.details?.total_area +
                      ' ' +
                      Common.Translations.translate('m2')}
                  </Text>
                  <Image source={Constants.Images.expand} />
                </View>
              </View>
            </View>
          ) : null}
        </React.Fragment>
      );
      break;
  }
};

const AmlakInfoView = (props) => {
  let Image_Http_URL = props.markerInfo.product.picture.length > 0 ?
    props.markerInfo.product.picture[0].picture : Constants.Images.cover;

  // props.markerInfo.product.picture.length > 0
  //   ? /* {
  //   uri: */ Constants.API.ImageBaseURL(
  //     props.markerInfo.product.picture[0].picture,
  //   )
  //   /* } */
  //   : Constants.Images.cover;
  return (
    <View
      style={[styles.container, props.containerStyle]}
      onStartShouldSetResponder={() => props.onClick()}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: wp('2%'),
          overflow: 'hidden',
          borderColor: '#E4E4E4',
          borderWidth: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              width: '60%',
              flexDirection: 'column',
            }}>
            <View style={{ width: '100%' }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('2.5%'),
                  color: '#B9B9B9',
                  marginTop: wp('0.2%'),
                  textAlign: 'left',
                  paddingLeft: wp('2%'),
                }}>
                {moment(
                  props.markerInfo.product.property_announcement_date,
                ).format('DD/MM/YYYY')}
              </Text>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3.5%'),
                  color: '#006FEB',
                  textAlign: 'right',
                  paddingRight: wp('2%'),
                }}>
                {`${Common.Helper.sign(props.markerInfo.product.currancy)}` +
                  props.markerInfo.product.price}
              </Text>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamelBold,
                  fontSize: wp('3%'),
                  color: '#444040',
                  textAlign: 'right',
                  paddingRight: wp('2%'),
                }}>
                {`${props.markerInfo.product.category_name
                  } ${Common.Translations.translate(
                    props.markerInfo.product.sale_or_rent,
                  )}`}
              </Text>
            </View>
            <View
              style={{
                width: wp('48%'),
                paddingVertical: wp('2%'),
                marginHorizontal: wp('1.5%'),
              }}>
              {renderProerties(props.markerInfo.product)}
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: wp('0.5%'),
                alignItems: 'flex-start',
                paddingRight: wp('2%'),
              }}>
              <Text
                style={{
                  color: '#444040',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3%'),
                  width: wp('41%'),
                  textAlign: 'right', alignSelf: 'stretch',
                  marginRight: wp('2%')
                }}>
                {`${props.markerInfo.product.region} ${props.markerInfo.product.address} ${props.markerInfo.product.city_id_arabic == undefined
                  ? ''
                  : Constants.API.Language == 'ar'
                    ? props.markerInfo.product.city_id_arabic
                    : props.markerInfo.product.city_id}
                  `}
              </Text>
              <Image source={Constants.Images.locationBlack} />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              width: '45%',
              overflow: 'hidden',
              alignItems: 'center',
            }}>
            <View style={{ width: '100%', height: hp('20%') }}>
              <AvatarComponent
                size={'large'}
                disabled={true}
                defaultSource={Constants.Images.cover}
                source={Image_Http_URL}
                style={{ width: '100%', height: hp('20%') }}
                imageStyle={{ width: '100%', height: hp('20%') }}
              />
              {/* <Image
                style={{width: '100%', height: hp('20%')}}
                source={Image_Http_URL}
              /> */}
              <Text
                style={{
                  paddingVertical: wp('1.5%'),
                  paddingHorizontal: wp('3%'),
                  position: 'absolute',
                  backgroundColor: '#444040',
                  color: 'white',
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('2.5%'),
                  top: wp('1%'),
                  right: wp('1%'),
                  borderRadius: wp('1%'),
                  overflow: 'hidden',
                }}>
                {Common.Helper.capitalize(
                  Common.Translations.translate(
                    props.markerInfo.product.sale_or_rent,
                  ),
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default AmlakInfoView;

const styles = StyleSheet.create({
  container: {
    width: wp('90%'),
    // backgroundColor: 'blue',
    flexDirection: 'row',
  },
});
