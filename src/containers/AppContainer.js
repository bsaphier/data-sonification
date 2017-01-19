import { connect } from 'react-redux';

import App from '../components/App';
import { fetchTweets } from '../actions';

const mapStateToProps = ({ mainReducer }) => ({ mainReducer });

const mapDispatchToProps = dispatch => ({
  fetchTweets: () =>
    dispatch(fetchTweets())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
