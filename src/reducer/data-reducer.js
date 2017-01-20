import {
  COUNT
} from '../constants';

const initialState = {
  locations: {}
};

// --------------------> REDUCER <--------------------
const dataReducer = (state = initialState, action) => {

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case COUNT:
      if (nextState.locations[action.place]) {
        nextState.locations[action.place]++;
      } else {
        nextState.locations[action.place] = 1;
      }
      return nextState;

    default:
      return nextState;
  }
};

export default dataReducer;
