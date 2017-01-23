import {
  COUNT,
  RECEIVE_TONE,
  TOGGLE_POSITIVITY,
} from '../constants';

const initialState = {
  tones: {},
  locations: {},
  joy: 0.000002,
  fear: 0.000001,
  anger: 0.000001,
  sadness: 0.000001,
  positivity: 0.001,
  lowPositivity: true
};

// --------------------> REDUCER <--------------------
const dataReducer = (state = initialState, action) => {

  let joy = state.joy,
    fear = state.fear,
    anger = state.anger,
    sadness = state.sadness;
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
        joy += (tone.tone_id === 'joy') ? tone.score : 0;
        fear += (tone.tone_id === 'fear') ? tone.score : 0;
        anger += (tone.tone_id === 'anger') ? tone.score : 0;
        sadness += (tone.tone_id === 'sadness') ? tone.score : 0;
        nextState.tones[tone.tone_id] = tone.score;
      });
      nextState.joy = joy;
      nextState.fear = fear;
      nextState.anger = anger;
      nextState.sadness = sadness;
      nextState.positivity = joy / (sadness + (anger * fear));
      return nextState;

    case TOGGLE_POSITIVITY:
      nextState.lowPositivity = !state.lowPositivity;
      return nextState;

    default:
      return nextState;
  }
};

export default dataReducer;
