/* globals io */
/* eslint-disable camelcase */
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
  setValueAtTime,
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
      socket.emit('didConnect');
    });

    socket.on('didConnectResponse', () => {

      dispatch(createOscillator('vco1'));
      dispatch(createOscillator('vco2'));
      // dispatch(createBiquadFilter('vcf1'));
      // dispatch(createBiquadFilter('vcf2'));
      dispatch(createGain('gain1'));
      dispatch(createGain('gain2'));

      // dispatch(connectAudioNodes('vco1', 'vcf1'));
      // dispatch(connectAudioNodes('vco2', 'vcf2'));
      dispatch(connectAudioNodes('vco1', 'gain1'));
      dispatch(connectAudioNodes('vco2', 'gain2'));

      dispatch(setParam('vco1.type', 'sawtooth'));
      dispatch(setParam('vco1.frequency.value', 41));
      dispatch(setParam('gain1.gain.value', 0));
      dispatch(connectAudioNodes('gain1'));

      dispatch(setParam('vco2.type', 'sine'));
      dispatch(setParam('vco2.frequency.value', 220));
      dispatch(setParam('gain2.gain.value', 0));
      dispatch(connectAudioNodes('gain2'));

      // dispatch(setParam('vcf1.type', 'lowpass'));

      dispatch(oscillatorStart('vco1', 0));
      dispatch(oscillatorStart('vco2', 0));

    });
  },

  openStream: ({ context }) => {

    socket.emit('fetchTweets');

    socket.on('tweet', tweet => {
      const { followers_count } = tweet.user;
      const { name } = tweet.place;

      dispatch(countPlace(name));
      dispatch(recieveTweet(tweet));

      switch (name) {
        case 'Manhattan':
          dispatch(linearRampToValueAtTime('gain1.gain', 0.3, context.currentTime + 0.05));
          socket.emit('manhattan');
          break;
        case 'Brooklyn':
          dispatch(linearRampToValueAtTime('gain2.gain', 0.5, context.currentTime + 0.05));
          socket.emit('brooklyn');
          break;
        case 'Bronx':
          socket.emit('Bronx');
          break;
        case 'Queens':
          socket.emit('queens');
          break;
        default: break;
      }
      // switch (true) {
      //   case (followers_count <= 500):
      //     // dispatch(setParam('vcf1.frequency.value', 200));
      //     socket.emit('fewFollowers');
      //     break;
      //   case (followers_count > 1000):
      //     // dispatch(setParam('vcf1.frequency.value', 2000));
      //     socket.emit('manyFollowers');
      //     break;
      //   default:
      //     break;
      // }
      socket.emit('tweetResponse');
    });

    socket.on('responseReceived', () => {
      dispatch(linearRampToValueAtTime('gain1.gain', 0.0, context.currentTime + 0.1));
      dispatch(linearRampToValueAtTime('gain2.gain', 0.0, context.currentTime + 0.1));
    });
  },

  killStream: () => {

    socket.emit('abort');
    dispatch(abort());
    dispatch(closeAudioContext());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
