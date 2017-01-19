/* globals io */
import {
  RECEIVE_TWEET
} from '../constants';

export const socket = io(window.location.origin);

// ----------------> ACTION CREATORS <----------------
export const recieveTweet = tweet => ({
  type: RECEIVE_TWEET,
  tweet
});

// --------------------> THUNKS <--------------------
export const fetchTweets = () => dispatch => {

  socket.on('tweet', tweet =>
    dispatch(recieveTweet(tweet))
  );

  // socket.on('connect', () => {
  //
  //   socket.on('tweet', tweet =>
  //     dispatch(recieveTweet(tweet))
  //   );
  //
  // });

};
