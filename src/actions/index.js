import axios from 'axios';

import {
  RECEIVE_TRAFFIC_DATA
} from '../constants';

const appToken = 'dOw6qFrw3bpNfha9hUXgNmCY3';

// ----------------> ACTION CREATORS <----------------
export const recieveTrafficData = data => ({
  type: RECEIVE_TRAFFIC_DATA,
  data
});

// --------------------> THUNKS <--------------------
export const fetchTrafficData = () => dispatch => {
  axios.get(`https://data.cityofnewyork.us/resource/xtra-f75s.json?$$app_token=${appToken}`)
    .then(res => dispatch(recieveTrafficData(res.data)))
    .catch(err => console.log('something went wrong, very wrong', err));
};
