const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const volleyball = require('volleyball');
const TweetStream = require('node-tweet-stream');

const app = express();
const server = http.createServer();

const rootPath = path.join(__dirname, '..');
const publicPath = path.join(rootPath, 'public');
const nodeModulesPath = path.join(rootPath, 'node_modules');

server.on('request', app);
app.set('port', (process.env.PORT || 1337));


// -~-~-~-~-~-~-~-~-~-~- LISTEN TO A TWITTER STREAM -~-~-~-~-~-~-~-~-~-~- \\
const io = socketio(server);
const twitter = new TweetStream(require('../twitter.config'));

io.on('connection', socket => {
  // * SEARCH PARAMS TWITTER STREAM TO LISTEN FOR * \\
  // ~-~-~ this location is NYC ~-~-~ \\
  twitter.location('-74,40,-73,41');

  // * TWITTER EVENT LISTENERS * \\
  twitter.on('tweet', tweet => socket.emit('tweet', tweet));
  twitter.on('error', err => console.log('Ohhh noooo, an errrrrrr', err));

  // * APP EVENT LISTENERS * \\
  // socket.on('didconnect', () => socket.emit('connectResponse'));

  // * TWEET RESPONSE -- use it like after-touch -- * \\
  socket.on('response', () => socket.emit('tweetResponse'));

  // * KILL SWITCH * \\
  socket.on('abort', () => twitter.abort());
});


// -~-~-~-~-~-~-~-~-~-~-~-~ LOGGING MIDDLEWARE ~-~-~-~-~-~-~-~-~-~-~-~- \\
app.use(volleyball);

// -~-~-~-~-~-~-~-~-~-~-~-~ SERVE STATIC ASSETS ~-~-~-~-~-~-~-~-~-~-~-~- \\
app.use(express.static(rootPath));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));


// -~-~-~-~-~-~-~-~-~-~-~-~-~-~ SERVE IT UP ~-~-~-~-~-~-~-~-~-~-~-~-~-~- \\
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// -~-~-~-~-~-~-~-~-~-~-~-~-~ START THE SERVER ~-~-~-~-~-~-~-~-~-~-~-~-~- \\
server.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});
