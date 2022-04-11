import React, {Component} from 'react';

import {TouchableWithoutFeedback,StyleSheet, View, Text, Keyboard, Image, Alert} from 'react-native';
import {connect} from 'react-redux';
import PhoneInput from 'react-native-phone-number-input';
import * as Constants from '../../constants/index';
import * as Common from '../../common/index';
import * as Components from '../../components/index';
import * as Services from '../../services/index';
import {Actions} from '../../redux/index';
import Stars from 'react-native-stars';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import User from '../../models/user';
let userID, userName;

class Rating extends Component {
  state = {
    comment: '',
    rating: 1,
    propertyDetail: '',
  };
  componentDidMount() {
    let userInstance = User.getInstance();
    if (userInstance.getUser().info) {
      userID = userInstance.getUser().info.id;
      userName = userInstance.getUser().info.name;
    }

    this.setState({
      propertyDetail: this.props.route.params.propertyDetail,
    });
  }
  submitAction = async () => {
    Keyboard.dismiss();
    console.log("print comment",this.state.comment);
    if (this.state.comment == '') {
      Common.Alert.show('alert', Common.Translations.translate('comment_here'));
      this.setState({errorFieldName: 'mobileNumberError'});
    } else {
      this.setState({errorFieldName: ''});
      console.log("Owner Detail",this.state.propertyDetail)
      this.props.toggleLoader(true);
      let rating = await Services.EstateServices.postReview({
        user_id: this.state.propertyDetail.owner.user_info.id,
        comment: this.state.comment,
        value: this.state.rating,
        user_name: userName,
      });
      this.props.toggleLoader(false);
      if (rating) {
        console.log('code---->', rating);
        this.props.navigation.goBack(null);
      }
      // this.props.navigation.push(Constants.Navigations.Onboarding.LOGIN)
    }
  };
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Components.AmlakHeader
          height={hp('11%')}
          isButtons={true}
          //   title={Common.Translations.translate('arithmetic')}
          onBackButtonClick={() => {
            this.props.navigation.pop();
          }}
        />
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Image
            style={{
              maxWidth: wp('19%'),
              maxHeight: wp('19%'),
              marginLeft: wp('2%'),
            }}
            source={Constants.Images.profile}
          />
          <Text
            style={{
              fontFamily: Constants.Fonts.shamel,
              color: '#444040',
              fontSize: wp('5%'),
              textAlign: 'right',
              padding: 15,
            }}>
            {this.state.propertyDetail.advertiser_name}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            style={{
              fontFamily: Constants.Fonts.SF_Display_Bold,
              color: '#444040',
              fontSize: wp('5%'),
              textAlign: 'center',
              padding: 15,
            }}
            numberOfLines={2}>
            {Common.Translations.translate('rate_experience') +
              this.state.propertyDetail.advertiser_name}
          </Text>

          <Stars
            // display={this.state.rating}
            spacing={8}
            count={5}
            starSize={30}
            fullStar={Constants.Images.starSelected}
            emptyStar={Constants.Images.star}
            update={(val) => {
              this.setState({rating: val});
            }}
          />
        </View>
        <View
          style={{
            flex: 3,
          }}>
          <View
            style={{
              flex: 2.8,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
            }}>
            <TextInput
              onChangeText={(comment) => {
                this.setState({
                  comment: comment,
                });
              }}
              multiline={true}
              textAlignVertical="top"
              keyboardType="default"
              placeholder={Common.Translations.translate('comment_here')}
              onSubmit={Keyboard.dismiss}
              style={{
                backgroundColor: '#f5f5f5',
                textAlign: 'right',
                flex: 1,
                borderRadius: 7,
                padding: 10,
              }}
            />
          </View>
          <View style={{flex: 3.2, justifyContent: 'center'}}>
            <Components.AmlakButton
              title="submit"
              titleStyles={{
                color: Constants.Colors.white,
                fontFamily: Constants.Fonts.shamelBold,
                fontSize: wp('5%'),
              }}
              containerStyles={{
                backgroundColor: Constants.Colors.buttonBackground,
                alignSelf: 'center',
              }}
              onClick={() => this.submitAction()}
            />
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLoader: (state) => dispatch(Actions.toggleLoader(state)),
});

export default connect(null, mapDispatchToProps)(Rating);
