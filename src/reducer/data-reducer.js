import {
  COUNT,
  TOGGLE,
  RECEIVE_TONE
} from '../constants';

const initialState = {
  tones: {},
  locations: {},
  joy: 0.000001,
  fear: 0.000001,
  anger: 0.000001,
  negative: true
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

    case RECEIVE_TONE:
      action.tones.forEach(tone => {
        nextState.joy += (tone.tone_id === 'joy') ? tone.score : 0;
        nextState.fear += (tone.tone_id === 'fear') ? tone.score : 0;
        nextState.anger += (tone.tone_id === 'anger') ? tone.score : 0;
        nextState.tones[tone.tone_id] = tone.score;
      });
      return nextState;

    case TOGGLE:
      nextState.negative = !nextState.negative;
      return nextState;

    default:
      return nextState;
  }
};

export default dataReducer;
