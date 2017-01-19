import {
  RECEIVE_TWEET
} from '../constants';

const initialState = {
  title: 'Check these tweets, yo!',
  tweet: false
};

// --------------------> REDUCER <--------------------
const mainReducer = (state = initialState, action) => {

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case RECEIVE_TWEET:
      nextState.tweet = action.tweet;
      return nextState;

    default:
      return nextState;
  }
};

export default mainReducer;
