import {
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TWEET
} from '../constants';

const initialState = {
  connected: false,
  tweet: false
};

// --------------------> REDUCER <--------------------
const streamReducer = (state = initialState, action) => {

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case CONNECTED:
      nextState.connected = true;
      return nextState;

    case ABORT_STREAM:
      nextState.tweet = false;
      nextState.connected = false;
      return nextState;

    case RECEIVE_TWEET:
      nextState.tweet = action.tweet;
      return nextState;

    default:
      return nextState;
  }
};

export default streamReducer;
