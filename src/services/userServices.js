import * as Common from "../common/index";
import * as Constants from "../constants/index";
import { Platform } from "react-native";

const userInformation = async (userID) => {
  try {
    const response = await Common.axios.get(
      Constants.API.User.USER_INFORMATION + `${userID}`
    );

    if (response && response.status == 200) {
      if (response.data && response.data.status == true) {
        return response.data.data;
      } else {
        return response.data;
      }
    }
  } catch (error) {
    console.log("error------>", error);
    return null;
  }
};

const deviceinfo = async (token) => {
  try {
    const body = {
      device_type: Platform.OS,
      device_token: token,
    };
    const response = await Common.axios.post(
      Constants.API.User.SET_DEVICE_INFO,
      body
    );
    if (response && response.status == 200) {
      console.log("response------>", response.data);
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    return error.message;
  }
};

const eventLogAPI = async (data) => {
  try {
    const body = {
      data: data,
    };
    const response = await Common.axios.post(
      Constants.API.User.EVENT_LOG,
      body
    );
    if (response && response.status == 200) {
      console.log("Event log has been called", response.data);
      if (response.data && response.data.access_token) {
      }
      return response.data;
    }
  } catch (error) {
    return error.message;
  }
};

export default {
  userInformation,
  deviceinfo,
  eventLogAPI,
};
