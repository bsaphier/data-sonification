import {
  RECEIVE_TRAFFIC_DATA
} from '../constants';

const initialState = {
  title: 'This is some text!',
  data: {}
};

// --------------------> REDUCER <--------------------
const mainReducer = (state = initialState, action) => {

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case RECEIVE_TRAFFIC_DATA:
      console.log(action.data);
      nextState.data = action.data;
      return nextState;

    default:
      return nextState;
  }
};

export default mainReducer;
