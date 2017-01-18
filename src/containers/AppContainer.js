import { connect } from 'react-redux';

import App from '../components/App';

const mapStateToProps = ({ mainReducer }) => ({ mainReducer });

export default connect(mapStateToProps)(App);
