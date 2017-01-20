/* globals io */
import { audioActionCreators } from 'react-redux-webaudio';

import {
  COUNT,
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TWEET
} from '../constants';

const socket = io(window.location.origin);
const {
  setParam,
  createGain,
  setValueAtTime,
  oscillatorStart,
  createOscillator,
  connectAudioNodes,
  connectNodeToParam,
  createBiquadFilter,
  linearRampToValueAtTime
} = audioActionCreators;

// ----------------> ACTION CREATORS <----------------
export const recieveTweet = tweet => ({
  type: RECEIVE_TWEET,
  tweet
});

export const socketConnected = () => ({
  type: CONNECTED
});

export const abort = () => ({
  type: ABORT_STREAM
});

export const countPlace = place => ({
  type: COUNT,
  place
});

// --------------------> THUNKS <--------------------
export const fetchTweets = ({ context, audioNodes }) => dispatch => {
  // create some audio nodes
  dispatch(createGain('lfoGain'));
  dispatch(createOscillator('lfo'));
  dispatch(createOscillator('vco'));
  dispatch(createBiquadFilter('vcf'));
  dispatch(createGain('output'));

  // connect the nodes
  dispatch(connectAudioNodes('vco', 'vcf'));
  dispatch(connectAudioNodes('vcf', 'output'));
  dispatch(connectAudioNodes('lfo', 'lfoGain'));
  dispatch(connectNodeToParam('lfoGain', audioNodes.vcf.frequency));

  dispatch(setParam('output.gain.value', 0.0));
  dispatch(setParam('vco.type', 'sawtooth'));
  dispatch(setParam('lfo.type', 'sawtooth'));

  dispatch(setParam('vco.frequency', 110));
  dispatch(setParam('lfo.frequency', 3));
  dispatch(setParam('lfoGain.gain', 100));
  dispatch(setParam('vcf.Q', 50));

  dispatch(oscillatorStart('vco', context.currentTime));
  dispatch(oscillatorStart('lfo', context.currentTime));

  dispatch(connectAudioNodes('output'));

  //listen for tweets
  socket.on('tweet', tweet => {
    dispatch(linearRampToValueAtTime('output.gain', 0.7, context.currentTime + 0.1));
    dispatch(countPlace(tweet.place.name));
    dispatch(recieveTweet(tweet));
    socket.emit('response');
  });

  socket.on('tweetResponse', () => {
    dispatch(linearRampToValueAtTime('output.gain', 0.0, context.currentTime + 0.1));
  }
  );
};

export const onConnect = () => dispatch =>
  socket.on('connect', () =>
    dispatch(socketConnected())
  );

export const killStream = () => dispatch => {
  dispatch(abort());
  socket.emit('abort');
};
