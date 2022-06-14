import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import User from '../../models/user';
import moment from 'moment';

//+970599552438
class MyAds extends Component {
  state = {
    selected: '1',

    items: [],
  };
   componentDidMount() {
   this.myAds('1');
   Common.Helper.logEvent('myads', {
  });
  }
  async myAds(type) {
    this.props.toggleLoader(true);
    let res = await Services.EstateServices.myAds()
    this.props.toggleLoader(false);
    if (res) {
      console.log('object', res);
      this.setState({ items: []});
      switch (type) {
        case '3':
          if (res.approved) {
            this.setState({ items: res.approved });
          }
          break;
          case '2':
            if (res.waiting) {
              this.setState({ items: res.waiting });
            }
            break;
        
        default:
          if (res.rejected) {
            this.setState({ items: res.rejected });
          }
          break;
      }
   
    }
  }
  renderItem = (value) => {
    let Image_Http_URL = Constants.Images.cover;
    try {
      Image_Http_URL =
        value.item.picture.length > 0
          ? { uri: value.item.picture[0].picture }
          : Constants.Images.cover;
    } catch (error) {
      return <View />
    }
    return (
      <View key = {`${value.item.id}`}
        style={{
          width: wp('100%'),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: wp('2%'),
        }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(
              Constants.Navigations.Dashboard.DETAIL,
              { id: value.item.id },
            )
          }>
          <View
            style={{
              width: wp('90%'),
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: wp('2%'),
            }}>
            <View
              style={{
                width: wp('90%'),
                minHeight: hp('23%'),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                style={{ width: wp('80%'), height: hp('23%') }}
                source={Image_Http_URL}
              />
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: '#444040',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: wp('4%'),
                  paddingVertical: wp('0.5%'),
                  right: wp('7%'),
                  top: wp('1%'),
                  borderRadius:wp('1.2%')
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    color: 'white',
                    marginTop: 2,
                  }}>
                  {
                   (value.item.sale_or_rent != null) &&
                    Common.Helper.capitalize(Common.Translations.translate(value.item.sale_or_rent))
                  }
                </Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: wp('2%'),
                width: wp('90%'),
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  width: wp('70%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#B9B9B9',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                  }}>
                  {moment(value.item.property_announcement_date).format(
                    'DD/MM/YYYY',
                  )}
                </Text>
                <Text
                  style={{
                    color: '#006FEB',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3.5%'),
                  }}>
                  {`${Common.Helper.sign(value.item.currancy)}` +
                    value.item.price}
                </Text>
              </View>

              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginVertical: wp('1%'),
                }}>
                <Text
                  style={{
                    color: '#444040',
                    width: wp('80%'),
                    textAlign: 'right',
                    fontFamily: Constants.Fonts.shamelBold,
                    fontSize: wp('3'),
                  }}>
                  {value.item.category_name}
                </Text>
              {
                this.renderProerties(value.item)
              }
              </View>
              <View
                style={{
                  width: wp('90%'),
                  height: hp('2%'),
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: wp('8%'),
                }}>
                <Text
                  style={{
                    color: '#444040',
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('2.5%'),
                    marginRight: wp('2%'),
                  }}>
                  {`${value.item.region} ${Constants.API.Language == 'ar'? value.item.city_id_arabic : value.item.city_id} ${value.item.address}`}
                </Text>
                <Image source={Constants.Images.locationBlack} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderProerties = (item) => {
    switch (item.category_id) {
      case 60:
        return (
          <React.Fragment>
            {item?.details?.office_area && item?.details?.office_area != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                      :Constants.API.Language == 'ar' ? item?.details?.door_type_arabic : item?.details?.door_type 
                     }
                  </Text>
                  <Image style = {{width:wp('3%'),height:wp('3.5%')}} source={Constants.Images.door} />
                </View>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
            ) : null}
          </React.Fragment>
        )
        break;
        case 30:
          return (
            <React.Fragment>
              {item?.details?.land_area && item?.details?.land_area != undefined ? (
                <View
                  style={{
                    width: wp('90%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: wp('6%'),
                    backgroundColor: 'transparent',
                  }}>
  
                  <View
                    style={{
                      marginRight: wp('2%'),
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                        :Constants.API.Language == 'ar' ? item?.details?.land_type_arabic : item?.details?.land_type
                        }
                    </Text>
                    <Image source={Constants.Images.typeBlack} />
                  </View>
                  <View
                    style={{
                      marginRight: wp('2%'),
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                        : item?.details?.land_area +
                        ' '}
                    </Text>
                    <Image source={Constants.Images.expand} />
                  </View>
                </View>
              ) : null}
            </React.Fragment>
          )
          break;
        case 50:
          return (
            <React.Fragment>
              {item?.details?.warehouse_area != undefined ? (
                <View
                  style={{
                    width: wp('90%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: wp('6%'),
                    backgroundColor: 'transparent',
                  }}>

                  <View
                    style={{
                      marginRight: wp('2%'),
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                        :Constants.API.Language == 'ar' ? item?.details?.door_type_arabic : item?.details?.door_type}
                    </Text>
                    <Image style = {{width:wp('3%'),height:wp('3.5%')}} source={Constants.Images.door} />
                  </View>

                  <View
                    style={{
                      marginRight: wp('2%'),
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                    <Image style = {{width:wp('3%'),height:wp('3.5%')}} source={Constants.Images.road} />
                  </View>

                  <View
                    style={{
                      marginRight: wp('2%'),
                      height: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
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
              ) : null}
            </React.Fragment>
          )
          break;
          case 40:
            return (
              <React.Fragment>
                {
                //item?.details?.warehouse_area != undefined ? (
                  <View
                    style={{
                      width: wp('90%'),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: wp('6%'),
                      backgroundColor: 'transparent',
                    }}>
  
                    <View
                      style={{
                        marginRight: wp('2%'),
                        height: hp('2%'),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#444040',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                          marginRight: wp('2%'),
                        }}>
                        {Constants.API.Language == 'ar' ? item?.details?.door_type_arabic: item?.details?.door_type}
                      </Text>
                      <Image style = {{width:wp('3%'),height:wp('3.5%')}} source={Constants.Images.door} />
                    </View>

                    <View
                      style={{
                        marginRight: wp('2%'),
                        height: hp('2%'),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#444040',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                          marginRight: wp('2%'),
                        }}>
                        {item?.details?.shop_street_width + ' ' +
                        Common.Translations.translate('m2')}
                      </Text>
                      <Image style = {{width:wp('3%'),height:wp('3.5%')}} source={Constants.Images.road} />
                    </View>

                    <View
                      style={{
                        marginRight: wp('2%'),
                        height: hp('2%'),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#444040',
                          fontFamily: Constants.Fonts.shamel,
                          fontSize: wp('3%'),
                          marginRight: wp('2%'),
                        }}>
                        {item?.details?.bath == undefined
                          ? '':
                          '1' +
                          Common.Translations.translate('bathRoom')}
                      </Text>
                      <Image source={Constants.Images.bathroom} />
                    </View>
  
  
                    <View
                      style={{
                        marginRight: wp('2%'),
                        height: hp('2%'),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
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
                      <Image style={{width:10, height:10}} source={Constants.Images.provinces} />
                    </View>
                  </View>
                //) : null
                }
              </React.Fragment>
            )
            break;
        
      
          default:
        return (
          <React.Fragment>
            {item?.details?.number_of_baths != undefined ? (
              <View
                style={{
                  width: wp('90%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: wp('6%'),
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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

                <View
                  style={{
                    marginRight: wp('2%'),
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                    height: hp('2%'),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
            ) : null}
          </React.Fragment>
        );
        break;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          title={Common.Translations.translate('myProperty')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        />
        <View
          style={{
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            height: wp('10%'),
            marginTop: wp('3%'),
            borderRadius: wp('10%') / 2,
            overflow: 'hidden',
            borderColor: 'grey',
            borderWidth: 0.5,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ selected: '1' });
              this.myAds('1');
            }}
            style={{
              width: wp('30%'),
              backgroundColor:
                this.state.selected == '1'
                  ? Constants.Colors.buttonBackground
                  : 'transparent',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                color:
                  this.state.selected == '1' ? Constants.Colors.white : 'black',
                fontSize: wp('3%'),
              }}>
              {Common.Translations.translate('ended')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ selected: '2' });
              this.myAds('2');
            }}
            style={{
              width: wp('30%'),
              backgroundColor:
                this.state.selected == '2'
                  ? Constants.Colors.buttonBackground
                  : 'transparent',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderStartWidth: 0.5,
              borderStartColor: '#EAEAEA',
              borderEndWidth: 0.5,
              borderEndColor: '#EAEAEA'
            }}>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                color:
                  this.state.selected == '2' ? Constants.Colors.white : 'black',
                fontSize: wp('3%'),
              }}>
              {Common.Translations.translate('pending')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ selected: '3' });
              this.myAds('3');
            }}
            style={{
              width: wp('30%'),
              backgroundColor:
                this.state.selected == '3'
                  ? Constants.Colors.buttonBackground
                  : 'transparent',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',

            }}>
            <Text
              style={{
                fontFamily: Constants.Fonts.shamel,
                color:
                  this.state.selected == '3' ? Constants.Colors.white : 'black',
                fontSize: wp('3%'),
              }}>
              {Common.Translations.translate('ongoing')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            height: '80%',
            marginTop: wp('2%'),
          }}>
          <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={this.state.items}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.id}`}
            ListHeaderComponent={() => (!this.state.items.length ?
              <Text style={styles.emptyMessageStyle}>{Common.Translations.translate('empty_list')}</Text>
              : null)}
          />
        </View>
      </View>
    );
  }
}
//970598252529
const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(MyAds);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  emptyMessageStyle: {
    textAlign: 'center',
    marginTop: hp('39%'),
    fontFamily: Constants.Fonts.shamelBold,
    fontSize: wp('4%')
  }
});
