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
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TONE,
  RECEIVE_TWEET,
  TOGGLE_POSITIVITY
} from '../constants';

// ----------------> ACTION CREATORS <----------------
export const recieveTweet = (tweet, manyFollowers) => ({
  type: RECEIVE_TWEET,
  tweet,
  manyFollowers
});

export const countPlace = place => ({
  type: COUNT,
  place
});

export const receiveTone = tones => ({
  type: RECEIVE_TONE,
  tones
});

export const togglePos = () => ({
  type: TOGGLE_POSITIVITY
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
  dispatch(setParam(`${name}.gain.value`, 0.62));
  dispatch(connectAudioNodes(name));
};

export const noteOn = (followers, tweet, place, param, ctx, socket) => dispatch => {
  const peak = followers ? 1.0 : 0.3;
  const attack = followers ? ctx.currentTime + 0.01 : ctx.currentTime + 0.15;
  dispatch(recieveTweet(tweet, followers));
  dispatch(countPlace(tweet.place.name));
  dispatch(linearRampToValueAtTime(param, peak, attack));
  socket.emit('tweetResponse', place, followers);
};

export const noteOff = (param, context) => dispatch => {
  dispatch(linearRampToValueAtTime(param, 0.0, context.currentTime + 0.25));
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

export const togglePositivity = ({isLow, positivity}) => dispatch => {
  let delaySend, feedback, send;
  if (isLow) {
    send = (positivity % 1 > 0.4 ? 0.4 : positivity % 1) / 3;
    delaySend = (positivity % 1 < 0.62 ? 0.62 : positivity % 1) / 2.1;
    dispatch(setParam('delaySend.gain.value', delaySend));
    dispatch(setParam('feedback.gain.value', 0.05));
    dispatch(setParam('send.gain.value', send));
  } else {
    send = (positivity % 1 < 0.3 ? 0.3 : positivity % 1) / 2.1;
    feedback = (positivity % 1 < 0.62 ? 0.62 : positivity % 1) / 1.3;
    dispatch(setParam('feedback.gain.value', feedback));
    dispatch(setParam('delaySend.gain.value', 0.1));
    dispatch(setParam('send.gain.value', send));
  }
  dispatch(togglePos());
};
