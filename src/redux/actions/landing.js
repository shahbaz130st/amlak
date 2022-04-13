import * as Constants from '../../constants/index';

export const saveUserInfo = (value) => {
  return {
    type: Constants.ActionTypes.User.SAVE_USER_INFO,
    payload: {
      data: value
    }
  }
}