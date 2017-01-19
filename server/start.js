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

const io = socketio(server);

io.on('connection', socket => {
  //receives the newly connected socket
  //called for each browser that connects to our server
  console.log('A new client has connected');
  console.log('socket id: ', socket.id);

  socket.on('tweet', tweet =>
    console.log('I finally got a tweet!', tweet)
  );
});


// ~~~~~ tell the server where to listen ~~~~~ \\
app.set('port', (process.env.PORT || 1337));

// ~~~~~ logging middleware ~~~~~ \\
app.use(volleyball);

// ~~~~~ serve static assets ~~~~~ \\
app.use(express.static(rootPath));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));


app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

server.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});


// -~-~-~-~-~-~-~-~-~-~- twitter stuffs -~-~-~-~-~-~-~-~-~-~- \\

const twitterConfig = require('../twitter.config');
const twitterClient = new Twitter(twitterConfig);


twitterClient.on('tweet', tweet => io.emit('tweet', tweet));

twitterClient.on('error', err => console.log('Ohhh noooo, an errrrer', err));

twitterClient.track('socket.io');
twitterClient.track('javascript');
