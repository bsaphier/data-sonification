import { combineReducers } from 'redux';

import dataReducer from './data-reducer';
import streamReducer from './stream-reducer';

export default combineReducers({
  dataReducer,
  streamReducer
});
