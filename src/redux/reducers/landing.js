import * as Constants from '../../constants/index';

const initialState = {
  userInfo: {},
};

export default (state, action) => {
  state = state || initialState
  switch (action.type) {
    case Constants.ActionTypes.User.SAVE_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload.data,
      }
    }
      break;
    case Constants.ActionTypes.Common.INITIATE_ONBOARDING: {
      return {
        ...initialState
      }
    }
      break;
    default:
      return state;
  }
};

