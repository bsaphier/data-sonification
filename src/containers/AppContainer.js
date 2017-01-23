/* globals io */
import { connect } from 'react-redux';
import { audioActionCreators } from 'react-redux-webaudio';

import App from '../components/App';
import {
  abort,
  loadIR,
  noteOn,
  noteOff,
  analyzeTone,
  socketConnected,
  togglePositivity,
  createCtxAndMasterGain
} from '../actions';

const {
  setParam,
  createGain,
  createDelay,
  oscillatorStart,
  createConvolver,
  createOscillator,
  connectAudioNodes,
  closeAudioContext,
  createDynamicsCompressor
} = audioActionCreators;

const socket = io(window.location.origin);

const mapStateToProps = ({ streamReducer, dataReducer, audioContextProvider }) => ({
  dataReducer,
  streamReducer,
  audioContextProvider
});

const mapDispatchToProps = dispatch => {
  const oscillators = ['vco1', 'vco2', 'vco3', 'vco4'];
  const gains = ['send', 'gain1', 'gain2', 'gain3', 'gain4', 'feedback', 'delaySend', 'channelGain'];
  const connections = [
    {thisNode: 'vco1', thatNode: 'gain1'},
    {thisNode: 'vco2', thatNode: 'gain2'},
    {thisNode: 'vco3', thatNode: 'gain3'},
    {thisNode: 'vco4', thatNode: 'gain4'},
    {thisNode: 'send', thatNode: 'delay'},
    {thisNode: 'delay', thatNode: 'feedback'},
    {thisNode: 'feedback', thatNode: 'delay'},
    {thisNode: 'delay', thatNode: 'delaySend'},
    {thisNode: 'channelGain', thatNode: 'send'},
    {thisNode: 'delay', thatNode: 'compressor'},
    {thisNode: 'channelGain', thatNode: 'compressor'},
    {thisNode: 'compressor', thatNode: 'masterGain'}
  ];

  return {
    togglePositivity: positivity => dispatch(togglePositivity(positivity)),


    killStream: () => {
      socket.emit('abort');
      dispatch(abort());
      dispatch(closeAudioContext());
    },


    didConnect: () => {

      dispatch(createCtxAndMasterGain('masterGain'));

      dispatch(createDynamicsCompressor('compressor'));
      dispatch(setParam('compressor.threshold.value', -34));
      dispatch(setParam('compressor.attack.value', 0.1));
      dispatch(setParam('compressor.release.value', 0.6));
      dispatch(setParam('compressor.ratio.value', 2));
      dispatch(setParam('compressor.knee.value', 13));

      dispatch(createConvolver('convolver'));
      dispatch(setParam('convolver.normalize', false));
      dispatch(loadIR('convolver'));

      socket.on('connect', () => {
        dispatch(socketConnected());
        socket.emit('didConnect');
      });

      socket.on('didConnectResponse', () => {

        oscillators.forEach(name => dispatch(createOscillator(name)));
        dispatch(createDelay('delay', 2.0));

        gains.forEach(name => dispatch(createGain(name)));
        dispatch(setParam('send.gain.value', 0.34));
        dispatch(setParam('delaySend.gain.value', 0.21));
        dispatch(setParam('feedback.gain.value', 0.62));
        dispatch(setParam('channelGain.gain.value', 0.8));
        dispatch(setParam('delay.delayTime.value', 0.05));

        connections.forEach(nodes =>
          dispatch(connectAudioNodes(nodes.thisNode, nodes.thatNode)));

        dispatch(connectAudioNodes('delaySend', 'convolver'));
        dispatch(connectAudioNodes('convolver', 'masterGain'));

        // Bronx OSC
        dispatch(setParam('vco1.type', 'triangle'));
        dispatch(setParam('vco1.frequency.value', 82.41));
        dispatch(setParam('gain1.gain.value', 0));
        dispatch(connectAudioNodes('gain1', 'channelGain'));

        // Brooklyn OSC
        dispatch(setParam('vco2.type', 'sine'));
        dispatch(setParam('vco2.frequency.value', 110));
        dispatch(setParam('gain2.gain.value', 0));
        dispatch(connectAudioNodes('gain2', 'channelGain'));

        // Queens OSC
        dispatch(setParam('vco3.type', 'triangle'));
        dispatch(setParam('vco3.frequency.value', 146.83));
        dispatch(setParam('gain3.gain.value', 0));
        dispatch(connectAudioNodes('gain3', 'channelGain'));

        // Manhattan OSC
        dispatch(setParam('vco4.type', 'sine'));
        dispatch(setParam('vco4.frequency.value', 196));
        dispatch(setParam('gain4.gain.value', 0));
        dispatch(connectAudioNodes('gain4', 'channelGain'));


        oscillators.forEach(name => dispatch(oscillatorStart(name, 0)));
      });
    },


    openStream: ({ context }) => {
      socket.emit('fetchTweets');

      socket.on('bronxResponse', manyFollowers => {
        if (manyFollowers) {
          dispatch(setParam('vco1.type', 'sawtooth'));
          dispatch(setParam('delay.delayTime.value', 0.089));
        }
        dispatch(noteOff('gain1.gain', context));
      });
      socket.on('queensResponse', manyFollowers => {
        if (manyFollowers) {
          dispatch(setParam('vco3.type', 'sawtooth'));
          dispatch(setParam('delay.delayTime.value', 0.055));
        }
        dispatch(noteOff('gain3.gain', context));
      });
      socket.on('brooklynResponse', manyFollowers => {
        if (manyFollowers) {
          dispatch(setParam('vco2.type', 'triangle'));
          dispatch(setParam('delay.delayTime.value', 0.055));
        }
        dispatch(noteOff('gain2.gain', context));
      });
      socket.on('manhattanResponse', manyFollowers => {
        if (manyFollowers) {
          dispatch(setParam('vco4.type', 'triangle'));
          dispatch(setParam('delay.delayTime.value', 0.034));
        }
        dispatch(noteOff('gain4.gain', context));
      });

      socket.on('bronx', ({ tweet, manyFollowers }) => {
        if (!manyFollowers) {
          dispatch(setParam('vco1.type', 'triangle'));
          dispatch(setParam('delay.delayTime.value', 0.987));
        }
        dispatch(noteOn(manyFollowers, tweet, 'bronx', 'gain1.gain', context, socket));
        dispatch(analyzeTone(tweet));
      });
      socket.on('queens', ({ tweet, manyFollowers }) => {
        if (!manyFollowers) {
          dispatch(setParam('vco3.type', 'triangle'));
          dispatch(setParam('delay.delayTime.value', 0.610));
        }
        dispatch(noteOn(manyFollowers, tweet, 'queens', 'gain3.gain', context, socket));
        dispatch(analyzeTone(tweet));
      });
      socket.on('brooklyn', ({ tweet, manyFollowers }) => {
        if (!manyFollowers) {
          dispatch(setParam('vco2.type', 'sine'));
          dispatch(setParam('delay.delayTime.value', 0.610));
        }
        dispatch(noteOn(manyFollowers, tweet, 'brooklyn', 'gain2.gain', context, socket));
        dispatch(analyzeTone(tweet));
      });
      socket.on('manhattan', ({ tweet, manyFollowers }) => {
        if (!manyFollowers) {
          dispatch(setParam('vco4.type', 'sine'));
          dispatch(setParam('delay.delayTime.value', 0.377));
        }
        dispatch(noteOn(manyFollowers, tweet, 'manhattan', 'gain4.gain', context, socket));
        dispatch(analyzeTone(tweet));
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
