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
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { Actions } from '../../redux/index';
import * as Components from '../../components/index';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Services from '../../services/index';
import moment from 'moment';

import User from '../../models/user';
class Profile extends Component {
  state = {
    isAds: false,
    DATA: [

    ],
    userInfo: { list_properties: [] },
    showReport: false,
    propertyId: '',
  };
  async componentDidMount() {
    this.props.toggleLoader(true)
    if (this.props.route.params) {
      let user = await Services.UserServices.userInformation(
        this.props.route.params.id,
      );
      if (user) {
        console.log(user);
        this.setState({ userInfo: user });
        this.setState({ DATA: user.reviews });
      }
    } else {
      let userInstance = User.getInstance();
      if (userInstance.getUser().info) {
        let user = await Services.UserServices.userInformation(
          userInstance.getUser().info.id,
        );
        if (user) {
          console.log(user);
          this.setState({ userInfo: user });
          this.setState({userInfo:{...user, profile_pic:userInstance.getUser().info.profile_pic}})
          this.setState({ DATA: user.reviews });
        }
      }
    }
    this.props.toggleLoader(false);
    Common.Helper.logEvent('profile', {
    });
  }
  actionSheetClicked = (type) => {
    if (type == 'repost') {
      this.showRepost();
    } else {
      this.deleteProperty();
    }
  };
  showRepost() {
    Alert.alert(
      `${this.state.propertyId}# ${Common.Translations.translate(
        'repost_add',
      )}`,
      `${Common.Translations.translate('report_messages')} #${this.state.propertyId
      }?`,
      [
        {
          text: Common.Translations.translate('do_not_want'),
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: Common.Translations.translate('want'),
          onPress: () => this.repost(),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }
  deleteProperty() {
    Alert.alert(
      `${this.state.propertyId} ${Common.Translations.translate(
        'delete_the_advertisement',
      )}`,
      `${Common.Translations.translate('delete_advertisement')} #${this.state.propertyId
      }?`,
      [
        {
          text: Common.Translations.translate('cancellation'),
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: Common.Translations.translate('delete'),
          onPress: () => this.deletePost(),
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }
  deletePost = async () => {
    this.props.toggleLoader(true);
    let post = await Services.EstateServices.deletePost(this.state.propertyId);
    if (post) {
      console.log(post);
    }
    this.props.toggleLoader(false);
  };
  repost = async () => {
    this.props.toggleLoader(true);
    let post = await Services.EstateServices.rePost(this.state.propertyId);
    if (post) {
      console.log(post);
    }
    this.props.toggleLoader(false);
  };
  renderRatingItem = (value) => (
    <View key={`${value.item.id}`}
      style={{
        width: wp('98%'),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: wp('1%'),
        overflow: 'hidden',
        flexDirection: 'column',
      }}>
      <Text
        style={{
          fontFamily: Constants.Fonts.shamel,
          fontSize: wp('2.5%'),
          color: '#B9B9B9',
          marginTop: wp('1%'),
          textAlign: 'left',
          paddingLeft: wp('2%'),
          width: '100%',
        }}>
        {value.item.created_at}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'column',
            width: '70%',
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('3.5%'),
              color: '#444040',
              marginTop: wp('1%'),
              textAlign: 'right',
              paddingLeft: wp('2%'),
              width: '100%',
              marginBottom: wp('0.5%')
            }}>
            {value.item.user_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <StarRating
              disabled={true}
              halfStarEnabled={true}
              maxStars={5}
              starSize={wp('4%')}
              emptyStar={Constants.Images.star}
              fullStar={Constants.Images.starSelected}
              rating={Number(value.item.total)}
            />
          </View>
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              fontSize: wp('3%'),
              color: '#444040',
              marginTop: wp('1%'),
              textAlign: 'right',
              paddingLeft: wp('2%'),
              width: '100%',
            }}>
            {value.item.comment}
          </Text>
        </View>
        <Image source={Constants.Images.profile} style={{ margin: wp('1%') }} />
      </View>
    </View>
  );

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
                      :Constants.API.Language == 'ar' ? item?.details?.door_type_arabic: item?.details?.door_type
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
                        :Constants.API.Language == 'ar' ? item?.details?.door_type_arabic: item?.details?.door_type}
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
                        {Constants.API.Language == 'ar' ? item?.details?.door_type_arabic : item?.details?.door_type}
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
  renderItem = (value) => {
    let Image_Http_URL = Constants.Images.cover;
    try {
      Image_Http_URL =
        value.item.picture.length > 0
          ? { uri: Constants.API.ImageBaseURL(value.item.picture[0].picture) }
          : Constants.Images.cover;
    } catch (error) {
      return <View />
    }
    return (
      <View
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
                  borderRadius: wp('1.2%')
                }}>
                <Text
                  style={{
                    fontFamily: Constants.Fonts.shamel,
                    fontSize: wp('3%'),
                    color: 'white',
                    marginTop: 2,
                  }}>
                  {Common.Helper.capitalize(Common.Translations.translate(value.item.sale_or_rent))}
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
                  {value.item.category_name + ' ' + Common.Helper.capitalize(value.item.sale_or_rent)}
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
        <View
          style={{
            position: 'absolute',
            padding: wp('3%'),
            backgroundColor: 'rgba(255,255,255,0.56)',
            width: wp('10%'),
            height: wp('10%'),
            borderRadius: wp('10%') / 2,
            justifyContent: 'center',
            alignItems: 'center',
            top: wp('2.5%'),
            left: wp('12%'),
          }}>
          <TouchableOpacity>
            <Image source={ value.item.is_fav == false ? Constants.Images.heartGray:Constants.Images.heartRed} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          leftButton={Constants.Images.setting}
          title={Common.Translations.translate('arithmetic')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
          onSettingClick={() => {
            this.props.navigation.push(Constants.Navigations.Setting.EDIT_PROFILE);
          }}
        />
        <View
          style={{
            width: '100%',
            marginTop: hp('2%'),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          {
            this.state.userInfo.profile_pic == null ? <View
              style={{
                width: wp('30%'),
                height: wp('30%'),
                borderRadius: wp('30%') / 2,
                backgroundColor: Constants.Colors.buttonBackground,
              }} />
              : <Image style={{ width: wp('30%'), height: wp('30%'), borderRadius: wp('30%') / 2 }}
                source={{ uri: this.state.userInfo.profile_pic }} />
          }

          <Text
            style={{
              color: '#444040',
              fontFamily: Constants.Fonts.shamelBold,
              fontSize: wp('4%'),
              marginTop: hp('1.5%'),
            }}>
            {this.state.userInfo.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: wp('3%'),
                color: '#444040',
                fontFamily: Constants.Fonts.shamel,
                height: wp('4%')
              }}>
              {`(${this.state.userInfo.total_rating})`}
            </Text>
            <StarRating
              disabled={true}
              maxStars={5}
              starSize={wp('4%')}
              emptyStar={Constants.Images.star}
              fullStar={Constants.Images.starSelected}
              rating={Number(this.state.userInfo.total_rating)}
            />
          </View>
          <View
            style={{
              width: wp('25%'),
              height: wp('10%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp('1.5%'),
            }}>
            <TouchableOpacity
              style={{
                width: wp('10%'),
                height: wp('10%'),
                borderRadius: wp('10%') / 2,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 0.5,
                borderColor: '#DDDDDD',
              }}>
              <Image source={Constants.Images.export} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: wp('10%'),
                height: wp('10%'),
                borderRadius: wp('10%') / 2,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 0.5,
                borderColor: '#DDDDDD',
              }}>
              <Image source={Constants.Images.callBlack} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: wp('3%'),
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flexDirection: 'column',
              width: '50%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isAds: false });
              }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3.5%'),
                  color: this.state.isAds == false ? '#006FEB' : '#444040',
                }}>
                {' '}
                {`(${this.state.userInfo.total_rating})`}{' '}
                {Common.Translations.translate('ratings')}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor:
                  this.state.isAds == false ? '#006FEB' : 'transparent',
                marginTop: wp('1%'),
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: '50%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isAds: true });
              }}>
              <Text
                style={{
                  fontFamily: Constants.Fonts.shamel,
                  fontSize: wp('3.5%'),
                  color: this.state.isAds == true ? '#006FEB' : '#444040',
                }}>
                {' '}
                {`(${this.state.userInfo.count_properties})`}{' '}
                {Common.Translations.translate('ads')}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor:
                  this.state.isAds == true ? '#006FEB' : 'transparent',
                marginTop: wp('1%'),
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '53%',
            marginTop: wp('2.5%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={
              this.state.isAds == false
                ? this.state.DATA
                : this.state.userInfo.list_properties
            }
            renderItem={
              this.state.isAds == false
                ? this.renderRatingItem
                : this.renderItem
            }
            keyExtractor={(item) => `${item.id}`}
            ListHeaderComponent={() => (this.state.isAds == false && !this.state.DATA.length ?
              <Text style={styles.emptyMessageStyle}>{Common.Translations.translate('empty_list_ratings')}</Text>
              : null)}
          />
        </View>
        {this.state.showReport && (
          <Components.AmlakPropertyAlert
            title={''}
            showBottomPicker={true}
            onSelectOption={(option) => {
              this.setState({ showReport: false });
              setTimeout(() => {
                this.actionSheetClicked(option);
              }, 1000);
            }}
            onCross={() => this.setState({ showReport: false })}
            closePicker={() => this.setState({ showReport: false })}
            selectedQuestion={[]}
            containerStyle={{
              top: null,
              bottom: 0,
              backgroundColor: 'white',
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  emptyMessageStyle: {
    textAlign: 'center',
    marginTop: hp('22%'),
    fontFamily: Constants.Fonts.shamelBold,
    fontSize: wp('4%')
  }
});
const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Profile);
