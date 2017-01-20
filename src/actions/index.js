/* globals io */
import {
  COUNT,
  CONNECTED,
  ABORT_STREAM,
  RECEIVE_TWEET
} from '../constants';

const socket = io(window.location.origin);

// ----------------> ACTION CREATORS <----------------
export const recieveTweet = tweet => ({
  type: RECEIVE_TWEET,
  tweet
});

export const socketConnected = () => ({
  type: CONNECTED
});

export const abort = () => ({
  type: ABORT_STREAM
});

export const countPlace = place => ({
  type: COUNT,
  place
});

// --------------------> THUNKS <--------------------
export const fetchTweets = () => dispatch =>
  socket.on('tweet', tweet => {
    dispatch(countPlace(tweet.place.name));
    dispatch(recieveTweet(tweet));
  });

export const onConnect = () => dispatch =>
  socket.on('connect', () =>
    dispatch(socketConnected())
  );

export const killStream = () => dispatch => {
  dispatch(abort());
  socket.emit('abort');
};
