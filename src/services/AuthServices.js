import * as Common from '../common/index';
import * as Constants from '../constants/index';
import NavigationServices from './navigationServices';
import {Alert} from 'react-native';

const userLogin = async (data) => {
  try {
    const body = {
      mobile: data.mobile,
      country_code: data.country_code,
    };
    const response = await Common.axios.post(
      Constants.API.Onboarding.LOGIN,
      body,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    setTimeout(function () {
      if (error.errors && error.errors.mobile.length > 0) {
        Alert.alert(
          Common.Translations.translate('alert'),
          error.errors.mobile[0],
          [
            {
              text: Common.Translations.translate('ok'),
              onPress: () =>
                NavigationServices.navigate(
                  Constants.Navigations.Onboarding.SIGNUP,
                ),
            },
          ],
          {cancelable: false},
        );
      } else {
        Common.Alert.show('alert', error.message);
      }
    }, 2000);
    return error.message;
  }
};

const rating = async (data) => {
  try {
    const body = {
      user_id: data.id,
      comment: data.comment,
      value: data.comment,
    };
    const response = await Common.axios.post(
      Constants.API.Onboarding.RATING,
      body,
    );
    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        // Common.KeyChain.save('userData',JSON.stringify(response.data.data));
        // Common.KeyChain.save('authToken','');
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    return error.message;
  }
};

const userSignup = async (data) => {
  try {
    console.log(data);
    const response = await Common.axios.post(
      Constants.API.Onboarding.SIGNUP,
      data,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response);
        if (response.data.errors && response.data.errors.mobile) {
          setTimeout(function () {
            Common.Alert.show('alert', response.data.errors.mobile[0]);
          }, 2000);
          return null;
        } else {
          return response.data.data;
        }
      } else {
        return response.data;
      }
    }
  } catch (error) {
    setTimeout(function () {
      console.log(JSON.stringify(error))
      return
      if (error?.errors?.mobile.length > 0) {
        Common.Alert.show('alert', error?.errors?.mobile[0]);
      } else {
        Common.Alert.show('alert', error?.message);
      }
    }, 2000);
    return null;
  }
};

const verifyUser = async (data) => {
  try {
    const body = {
      mobile: data.mobile,
      activation_code: data.code,
      user_id: data.user_id,
    };
    const response = await Common.axios.post(
      Constants.API.Onboarding.ACTIVATE_USER,
      body,
    );
    if (response && response.status == 200) {
      console.log('response------>', response.data);
      if (response.data && response.data.access_token) {
        let token = JSON.stringify(response.data.access_token);
        Common.KeyChain.save('authToken', token);
        Constants.API.Token = token;
      }
      return response.data;
    }
  } catch (error) {
    return error.message;
  }
};

const updateLocation = async () => {
  try {
    let location = await Common.Helper.location();
    if (location) {
      console.log('Request------>', location);
      const body = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const response = await Common.axios.post(
        Constants.API.Onboarding.ACTIVATE_USER,
        body,
      );
      if (response && response.status == 200) {
        return true;
      }
    }
  } catch (error) {
    // setTimeout(function () {
    //   Common.Alert.show('alert', error.message);
    // }, 2000);
    return error.message;
  }
};

const userData = async () => {
  try {
    const response = await Common.axios.get(Constants.API.Onboarding.USER_DATA);
    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};

const updateProfile = async (data) => {
  try {
    console.log(data);
    const response = await Common.axios.post(
      Constants.API.Dashboard.UPDATE_PROFILE,
      data,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
const disableUser = async (data) => {
  try {
    console.log(data);
    const response = await Common.axios.post(
      Constants.API.Onboarding.DISABLE_USER,
      data,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data);
        return response.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
const enableUser = async (data) => {
  try {
    console.log(data);
    const response = await Common.axios.post(
      Constants.API.Onboarding.ENABLE_USER,
      data,
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        console.log(response.data);
        return response.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log('error------>', error);
    setTimeout(function () {
      Common.Alert.show('alert', error.message);
    }, 2000);
    return null;
  }
};
export default {
  userLogin,
  userSignup,
  verifyUser,
  updateLocation,
  userData,
  rating,
  updateProfile,
  disableUser,
  enableUser
};
