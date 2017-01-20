import { connect } from 'react-redux';

import App from '../components/App';
import {
  onConnect,
  killStream,
  fetchTweets
} from '../actions';

const mapStateToProps = ({ streamReducer, dataReducer }) => ({
  dataReducer,
  streamReducer
});

const mapDispatchToProps = dispatch => ({

  killStream: () => dispatch(killStream()),

  fetchTweets: () => dispatch(fetchTweets()),

  onConnect: () => dispatch(onConnect())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
