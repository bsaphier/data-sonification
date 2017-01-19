/* globals io */
const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('I am now listening to twitter!');

  socket.on('tweet', tweet =>
    console.log('I finally got a tweet!', tweet)
  );

});
