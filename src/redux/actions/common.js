import * as Constants from '../../constants/index';
 
export const toggleLoader = (value) => {
  return {
    type: Constants.ActionTypes.Common.IS_LOADING,
    payload: {
      data: value
    }
  }
}
export const restorePropertyDetail = (value) => {
  return {
    type: Constants.ActionTypes.Common.FROM_PROPERTY_DETAIL,
    payload: {
      id: value
    }
  }
}
