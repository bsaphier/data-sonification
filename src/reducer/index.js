import { combineReducers } from 'redux';
import { audioContextProvider } from 'react-redux-webaudio';

import dataReducer from './data-reducer';
import streamReducer from './stream-reducer';

export default combineReducers({
  dataReducer,
  streamReducer,
  audioContextProvider
});
