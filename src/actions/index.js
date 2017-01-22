import axios from 'axios';
import { audioActionCreators } from 'react-redux-webaudio';

const {
  setParam,
  createGain,
  decodeAudioData,
  connectAudioNodes,
  linearRampToValueAtTime,
  createGlobalAudioContext
} = audioActionCreators;

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
export const createCtxAndMasterGain = name => dispatch => {
  dispatch(createGlobalAudioContext());
  dispatch(createGain(name));
  dispatch(setParam(`${name}.gain.value`, 0.7));
  dispatch(connectAudioNodes(name));
};

export const noteOn = (tweet, place, param, ctx, delay, socket) => dispatch => {
  dispatch(recieveTweet(tweet));
  dispatch(countPlace(tweet.place.name));
  dispatch(
    linearRampToValueAtTime(param, 0.5, ctx.currentTime + 0.03));
  dispatch(setParam('delay.delayTime.value', delay));
  socket.emit('tweetResponse', place);
};

export const noteOff = (param, context) => dispatch => {
  dispatch(linearRampToValueAtTime(param, 0.0, context.currentTime + 0.22));
};

export const loadIR = bufferSource => dispatch => {
  axios.get('/bin/irHall.ogg', { responseType: 'arraybuffer' })
    .then(res => {
      dispatch(decodeAudioData(res.data, decodedAudio => {
        dispatch(setParam(`${bufferSource}.buffer`, decodedAudio));
      }));
    });
};
