import { connect } from 'react-redux';

import App from '../components/App';
import { fetchTrafficData } from '../actions';

const mapStateToProps = ({ mainReducer }) => ({ mainReducer });

const mapDispatchToProps = dispatch => ({
  fetchTrafficData: () =>
    dispatch(fetchTrafficData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
