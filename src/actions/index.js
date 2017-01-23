/*eslint-disable camelcase maxparams */
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
  TOGGLE,
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TONE,
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

export const receiveTone = tones => ({
  type: RECEIVE_TONE,
  tones
});

export const socketConnected = () => ({
  type: CONNECTED
});

export const abort = () => ({
  type: ABORT_STREAM
});

export const toggle = () => ({
  type: TOGGLE
});


// --------------------> THUNKS <--------------------
export const createCtxAndMasterGain = name => dispatch => {
  dispatch(createGlobalAudioContext());
  dispatch(createGain(name));
  dispatch(setParam(`${name}.gain.value`, 0.7));
  dispatch(connectAudioNodes(name));
};

export const noteOn = (tweet, place, param, ctx, rverb, socket) => dispatch => {
  dispatch(recieveTweet(tweet));
  dispatch(countPlace(tweet.place.name));
  dispatch(
    linearRampToValueAtTime(param, 0.6, ctx.currentTime + 0.02));
  dispatch(setParam('delaySend.gain.value', rverb));
  socket.emit('tweetResponse', place);
};

export const noteOff = (param, context) => dispatch => {
  dispatch(linearRampToValueAtTime(param, 0.0, context.currentTime + 0.15));
  dispatch(setParam('delaySend.gain.value', 0.02));
};

export const loadIR = bufferSource => dispatch => {
  axios.get('/bin/irHall.ogg', { responseType: 'arraybuffer' })
    .then(res => {
      dispatch(decodeAudioData(res.data, decodedAudio => {
        dispatch(setParam(`${bufferSource}.buffer`, decodedAudio));
      }));
    });
};

export const analyzeTone = tweet => dispatch => {
  axios.post('/api/tone', tweet)
    .then(res => {
      const { tones } = res.data.document_tone.tone_categories[0];
      dispatch(receiveTone(tones));
    })
    .catch(err =>
      console.log(err)
    );
};
