import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

// Reducers
import * as Redux from '../redux/index';

const rootReducer = combineReducers({
  common:Redux.Reducers.Common,
  landing: Redux.Reducers.Landing
});

export default () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
