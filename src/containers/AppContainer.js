/* globals io */
import { connect } from 'react-redux';
import { audioActionCreators } from 'react-redux-webaudio';

import App from '../components/App';
import {
  abort,
  countPlace,
  recieveTweet,
  socketConnected
} from '../actions';

const {
  setParam,
  createGain,
  oscillatorStart,
  createOscillator,
  connectAudioNodes,
  closeAudioContext,
  createBiquadFilter,
  linearRampToValueAtTime,
  createGlobalAudioContext,
} = audioActionCreators;
const socket = io(window.location.origin);

const mapStateToProps = ({ streamReducer, dataReducer, audioContextProvider }) => ({
  dataReducer,
  streamReducer,
  audioContextProvider
});

const mapDispatchToProps = dispatch => ({

  didConnect: () => {
    dispatch(createGlobalAudioContext());

    socket.on('connect', () => {
      dispatch(socketConnected());
      console.log('******* CONNECTED *******');
    });
  },

  killStream: () => {

    socket.emit('abort');
    dispatch(abort());
    dispatch(closeAudioContext());
  },

  fetchTweets: ({ context }) => {

    // dispatch(createGain('lfoGain'));
    // dispatch(createOscillator('lfo'));
    dispatch(createOscillator('vco'));
    dispatch(createBiquadFilter('vcf'));
    dispatch(createGain('output'));

    dispatch(connectAudioNodes('vco', 'vcf'));
    dispatch(connectAudioNodes('vcf', 'output'));
    // dispatch(connectAudioNodes('lfo', 'lfoGain'));

    dispatch(setParam('output.gain.value', 0));
    dispatch(setParam('vco.type', 'sawtooth'));
    // dispatch(setParam('lfo.type', 'sawtooth'));

    dispatch(oscillatorStart('vco', 0));

    dispatch(connectAudioNodes('output'));

    socket.on('tweet', tweet => {
      dispatch(linearRampToValueAtTime('output.gain', 0.8, context.currentTime + 0.2));
      dispatch(countPlace(tweet.place.name));
      dispatch(recieveTweet(tweet));
      socket.emit('response');
    });

    socket.on('tweetResponse', () => {
      console.log('******* TWEET RESPONSE *******');
      dispatch(linearRampToValueAtTime('output.gain', 0.0, context.currentTime + 1.1));
    });
  }

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
