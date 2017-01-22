const path = require('path');
const http = require('http');
const chalk = require('chalk');
const express = require('express');
const socketio = require('socket.io');
const volleyball = require('volleyball');
const TweetStream = require('node-tweet-stream');

const app = express();
const server = http.createServer();

const rootPath = path.join(__dirname, '..');
const binPath = path.join(rootPath, 'bin');
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

  // ------------------> APP EVENT LISTENERS <------------------ \\
  socket.on('didConnect', () => {
    console.log(chalk.inverse.dim.green('*******'), chalk.green(' CONNECTED '), chalk.inverse.dim.green('*******'));
    socket.emit('didConnectResponse');
  });

  socket.on('abort', () => {
    twitter.abort();
    console.log(chalk.red('*-~STREAM-KILLED-&-AUDIO-CONTEXT-CLOSED~-*'));
  });

  socket.on('fetchTweets', () => {
    twitter.on('tweet', tweet => {
      const { name } = tweet.place;
      // const { followers_count } = tweet.user;

      switch (name) {
        case 'Bronx':
          console.log(chalk.green('<-~-~B-~R-~O-~N-~X-*'));
          socket.emit('bronx', tweet);
          break;
        case 'Queens':
          console.log(chalk.magenta('<-~-~Q-~U-~E-~E-~N-~S-*'));
          socket.emit('queens', tweet);
          break;
        case 'Brooklyn':
          console.log(chalk.yellow('<-~-~B-~R-~O-~O-~K-~L-~Y-~N-*'));
          socket.emit('brooklyn', tweet);
          break;
        case 'Manhattan':
          console.log(chalk.cyan('<-~-~M-~A-~N-~H-~A-~T-~T-~A-~N-*'));
          socket.emit('manhattan', tweet);
          break;
        default:
          console.log(chalk.gray('<-~-~O-~T-~H-~E-~R-*'));
      }
    });
    twitter.on('error', err =>
      console.log(chalk.bold.red('*!~!~!- errerrr -!~!~!*'), err)
    );
  });

  socket.on('tweetResponse', location => {
    switch (location) {
      case 'bronx':
        console.log(chalk.dim.green('*~B-~R-~O-~N-~X-~-~>'));
        socket.emit('bronxResponse');
        break;
      case 'queens':
        console.log(chalk.dim.magenta('*~Q-~U-~E-~E-~N-~S-~-~>'));
        socket.emit('queensResponse');
        break;
      case 'brooklyn':
        console.log(chalk.dim.yellow('*~B-~R-~O-~O-~K-~L-~Y-~N-~-~>'));
        socket.emit('brooklynResponse');
        break;
      case 'manhattan':
        console.log(chalk.dim.cyan('*~M-~A-~N-~H-~A-~T-~T-~A-~N-~-~>'));
        socket.emit('manhattanResponse');
        break;
      default:
        console.log(chalk.bold.red('*~W-~T-~F-*'));
    }
  });
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
