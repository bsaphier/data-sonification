const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const volleyball = require('volleyball');
const Twitter = require('node-tweet-stream');

const app = express();
const server = http.createServer();

const rootPath = path.join(__dirname, '..');
const publicPath = path.join(rootPath, 'public');
const nodeModulesPath = path.join(rootPath, 'node_modules');

server.on('request', app);


// -~-~-~-~-~-~-~-~-~-~- LISTEN TO A TWITTER STREAM -~-~-~-~-~-~-~-~-~-~- \\
const io = socketio(server);
const twitterClient = new Twitter(require('../twitter.config'));

io.on('connection', socket => {

  twitterClient.on('tweet', tweet =>
    socket.emit('tweet', tweet.text)
  );

  twitterClient.on('error', err =>
    console.log('Ohhh noooo, an errrrrrr', err)
  );

  // * THE KEYWORD FOR THE TWITTER STREAM TO LISTEN FOR * \\
  twitterClient.track('javascript');
});


// -~-~-~-~-~-~-~-~-~-~-~-~ LOGGING MIDDLEWARE ~-~-~-~-~-~-~-~-~-~-~-~- \\
app.use(volleyball);

// -~-~-~-~-~-~-~-~-~-~-~-~ SERVE STATIC ASSETS ~-~-~-~-~-~-~-~-~-~-~-~- \\
app.use(express.static(rootPath));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));


// -~-~-~-~-~-~-~-~-~-~-~-~-~ START THE SERVER ~-~-~-~-~-~-~-~-~-~-~-~-~- \\
app.set('port', (process.env.PORT || 1337));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

server.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});
