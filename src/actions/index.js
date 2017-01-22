/* globals io */
import { audioActionCreators } from 'react-redux-webaudio';

import {
  COUNT,
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TWEET
} from '../constants';

// ----------------> ACTION CREATORS <----------------
export const recieveTweet = tweet => ({
  type: RECEIVE_TWEET,
  tweet
});

export const countPlace = place => ({
  type: COUNT,
  place
});

export const socketConnected = () => ({
  type: CONNECTED
});

export const abort = () => ({
  type: ABORT_STREAM
});

// --------------------> THUNKS <--------------------
