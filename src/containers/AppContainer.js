/* globals io */
import { connect } from 'react-redux';
import { audioActionCreators } from 'react-redux-webaudio';

import App from '../components/App';
import {
  abort,
  loadIR,
  toggle,
  noteOn,
  noteOff,
  analyzeTone,
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
    toneDidChange: joy => {
      if (joy) {
        dispatch(setParam('vco1.type', 'triangle'));
        dispatch(setParam('vco2.type', 'sine'));
        dispatch(setParam('vco3.type', 'triangle'));
        dispatch(setParam('vco4.type', 'sine'));
      } else {
        dispatch(setParam('vco1.type', 'square'));
        dispatch(setParam('vco2.type', 'triangle'));
        dispatch(setParam('vco3.type', 'square'));
        dispatch(setParam('vco4.type', 'triangle'));
      }
      dispatch(toggle());
    },

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
        dispatch(setParam('send.gain.value', 0.34));
        dispatch(setParam('delaySend.gain.value', 0.38));
        dispatch(setParam('feedback.gain.value', 0.62));
        dispatch(setParam('channelGain.gain.value', 0.8));
        dispatch(setParam('delay.delayTime.value', 0.05));

        connections.forEach(nodes =>
          dispatch(connectAudioNodes(nodes.thisNode, nodes.thatNode)));

        dispatch(connectAudioNodes('delaySend', 'convolver'));
        dispatch(connectAudioNodes('convolver', 'masterGain'));

        dispatch(setParam('vco1.type', 'triangle'));
        dispatch(setParam('vco1.frequency.value', 82.41));
        dispatch(setParam('gain1.gain.value', 0));
        dispatch(connectAudioNodes('gain1', 'channelGain'));

        dispatch(setParam('vco2.type', 'sine'));
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

    openStream: ({ context }, positivity) => {
      let rverb;
      if (positivity >= 0 && positivity <= 1) {
        rverb = positivity;
      } else if (positivity < 0) {
        rverb = (positivity * -1) / 100;
      } else {
        rverb = positivity / 10;
      }
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

      socket.on('bronx', ({ tweet, manyFollowers }) => {
        const delTime = manyFollowers ? 0.144 : 0.021;
        dispatch(analyzeTone(tweet));
        dispatch(setParam('delay.delayTime.value', delTime));
        dispatch(noteOn(tweet, 'bronx', 'gain1.gain', context, rverb, socket));
      });
      socket.on('queens', ({ tweet, manyFollowers }) => {
        const delTime = manyFollowers ? 0.377 : 0.034;
        dispatch(analyzeTone(tweet));
        dispatch(setParam('delay.delayTime.value', delTime));
        dispatch(noteOn(tweet, 'queens', 'gain3.gain', context, rverb, socket));
      });
      socket.on('brooklyn', ({ tweet, manyFollowers }) => {
        const delTime = manyFollowers ? 0.987 : 0.055;
        dispatch(analyzeTone(tweet));
        dispatch(setParam('delay.delayTime.value', delTime));
        dispatch(noteOn(tweet, 'brooklyn', 'gain2.gain', context, rverb, socket)
        );
      });
      socket.on('manhattan', ({ tweet, manyFollowers }) => {
        const delTime = manyFollowers ? 1.597 : 0.089;
        dispatch(analyzeTone(tweet));
        dispatch(setParam('delay.delayTime.value', delTime));
        dispatch(noteOn(tweet, 'manhattan', 'gain4.gain', context, rverb, socket));
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
