/* globals io */
import { connect } from 'react-redux';
import { audioActionCreators } from 'react-redux-webaudio';

import App from '../components/App';
import {
  abort,
  loadIR,
  noteOn,
  noteOff,
  socketConnected,
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
    {thisNode: 'delay', thatNode: 'masterGain'},
    {thisNode: 'channelGain', thatNode: 'masterGain'}
  ];

  return {
    didConnect: () => {

      dispatch(createCtxAndMasterGain('masterGain'));

      // dispatch(createBufferSource('irHallBuffer'));
      dispatch(createConvolver('convolver'));
      dispatch(setParam('convolver.normalize', true));
      dispatch(loadIR('convolver'));

      socket.on('connect', () => {
        dispatch(socketConnected());
        socket.emit('didConnect');
      });

      socket.on('didConnectResponse', () => {

        oscillators.forEach(name => dispatch(createOscillator(name)));
        dispatch(createDelay('delay'));

        gains.forEach(name => dispatch(createGain(name)));
        dispatch(setParam('send.gain.value', 0.1));
        dispatch(setParam('delaySend.gain.value', 0.62));
        dispatch(setParam('feedback.gain.value', 0.38));
        dispatch(setParam('channelGain.gain.value', 0.62));
        dispatch(setParam('delay.delayTime.value', 0.01));

        connections.forEach(nodes =>
          dispatch(connectAudioNodes(nodes.thisNode, nodes.thatNode)));

        dispatch(connectAudioNodes('delaySend', 'convolver'));
        dispatch(connectAudioNodes('convolver', 'masterGain'));

        dispatch(setParam('vco1.type', 'triangle'));
        dispatch(setParam('vco1.frequency.value', 82.41));
        dispatch(setParam('gain1.gain.value', 0));
        dispatch(connectAudioNodes('gain1', 'channelGain'));

        dispatch(setParam('vco2.type', 'triangle'));
        dispatch(setParam('vco2.frequency.value', 110));
        dispatch(setParam('gain2.gain.value', 0));
        dispatch(connectAudioNodes('gain2', 'channelGain'));

        dispatch(setParam('vco3.type', 'triangle'));
        dispatch(setParam('vco3.frequency.value', 146.83));
        dispatch(setParam('gain3.gain.value', 0));
        dispatch(connectAudioNodes('gain3', 'channelGain'));

        dispatch(setParam('vco4.type', 'sine'));
        dispatch(setParam('vco4.frequency.value', 196));
        dispatch(setParam('gain4.gain.value', 0));
        dispatch(connectAudioNodes('gain4', 'channelGain'));


        oscillators.forEach(name => dispatch(oscillatorStart(name, 0)));
      });
    },

    killStream: () => {
      socket.emit('abort');
      dispatch(abort());
      dispatch(closeAudioContext());
    },

    openStream: ({ context }) => {
      // dispatch(setParam('convolver.buffer', audioNodes.irHallBuffer));
      socket.emit('fetchTweets');

      socket.on('bronxResponse', () =>
        dispatch(
          noteOff('gain1.gain', context)
        )
      );
      socket.on('queensResponse', () =>
        dispatch(
          noteOff('gain3.gain', context)
        )
      );
      socket.on('brooklynResponse', () =>
        dispatch(
          noteOff('gain2.gain', context)
        )
      );
      socket.on('manhattanResponse', () =>
        dispatch(
          noteOff('gain4.gain', context)
        )
      );

      socket.on('bronx', tweet =>
        dispatch(
          noteOn(tweet, 'bronx', 'gain1.gain', context, 0.233, socket)
        )
      );
      socket.on('queens', tweet =>
        dispatch(
          noteOn(tweet, 'queens', 'gain3.gain', context, 0.377, socket)
        )
      );
      socket.on('brooklyn', tweet =>
        dispatch(
          noteOn(tweet, 'brooklyn', 'gain2.gain', context, 0.144, socket)
        )
      );
      socket.on('manhattan', tweet =>
        dispatch(
          noteOn(tweet, 'manhattan', 'gain4.gain', context, 0.055, socket)
        )
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
