import { connect } from 'react-redux';
import { audioActionCreators } from 'react-redux-webaudio';

import App from '../components/App';
import {
  onConnect,
  killStream,
  fetchTweets
} from '../actions';

const { createGlobalAudioContext } = audioActionCreators;

const mapStateToProps = ({ streamReducer, dataReducer, audioContextProvider }) => ({
  dataReducer,
  streamReducer,
  audioContextProvider
});

const mapDispatchToProps = dispatch => ({

  killStream: () => dispatch(killStream()),

  fetchTweets: (audioContextAndGraph) =>
    dispatch(fetchTweets(audioContextAndGraph)),

  onConnect: () => dispatch(onConnect()),

  createAudioCtx: () => dispatch(createGlobalAudioContext())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
