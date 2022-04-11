import * as Constants from '../../constants/index';


const initialState = {
  isLoading: false,
  propertyDetailId: '',
};

export default (state, action) => {
  state = state || initialState
  switch (action.type) {
    case Constants.ActionTypes.Common.IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload.data
      }
    }
    case Constants.ActionTypes.Common.FROM_PROPERTY_DETAIL: {
      return {
        ...state,
        propertyDetailId: action.payload.id
      }
    }
      break;

    default:
      return state;
  }
};