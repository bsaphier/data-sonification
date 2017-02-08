/*eslint-disable camelcase */
const path = require('path');
const http = require('http');
const chalk = require('chalk');
const express = require('express');
const socketio = require('socket.io');
// const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const TweetStream = require('node-tweet-stream');
const watson = require('watson-developer-cloud');

const app = express();
const server = http.createServer();

const rootPath = path.join(__dirname, '..');
const publicPath = path.join(rootPath, 'public');
const nodeModulesPath = path.join(rootPath, 'node_modules');

const toneAnalyzer = watson.tone_analyzer(require('../watson.config'));

server.on('request', app);
app.set('port', (process.env.PORT || 1337));


// -~-~-~-~-~-~-~-~-~-~- LISTEN TO A TWITTER STREAM -~-~-~-~-~-~-~-~-~-~- \\
const io = socketio(server);
const twitter = new TweetStream(require('../twitter.config'));

io.on('connection', socket => {

  // * SEARCH PARAMS TWITTER STREAM TO LISTEN FOR * \\
  // ~-~-~ this location is NYC ~-~-~ \\
  twitter.location('-74,40,-73,41');
  // twitter.track('synthesizer');

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
      const { followers_count } = tweet.user;
      const manyFollowers = followers_count > 500;

      switch (name) {
        case 'Bronx':
          console.log(chalk.green('<-~-~B-~R-~O-~N-~X-*'));
          socket.emit('bronx', {tweet, manyFollowers});
          break;
        case 'Queens':
          console.log(chalk.magenta('<-~-~Q-~U-~E-~E-~N-~S-*'));
          socket.emit('queens', {tweet, manyFollowers});
          break;
        case 'Brooklyn':
          console.log(chalk.yellow('<-~-~B-~R-~O-~O-~K-~L-~Y-~N-*'));
          socket.emit('brooklyn', {tweet, manyFollowers});
          break;
        case 'Manhattan':
          console.log(chalk.cyan('<-~-~M-~A-~N-~H-~A-~T-~T-~A-~N-*'));
          socket.emit('manhattan', {tweet, manyFollowers});
          break;
        default:
          // console.log(chalk.gray('<-~-~O-~T-~H-~E-~R-*'));
          break;
      }
    });
    twitter.on('error', err =>
      console.log(chalk.bold.red('*!~!~!- errerrr -!~!~!*'), err)
    );
  });

  socket.on('tweetResponse', (location, manyFollowers) => {
    switch (location) {
      case 'bronx':
        console.log(chalk.bold.green('*~B-~R-~O-~N-~X-~-~>'));
        socket.emit('bronxResponse', manyFollowers);
        break;
      case 'queens':
        console.log(chalk.bold.magenta('*~Q-~U-~E-~E-~N-~S-~-~>'));
        socket.emit('queensResponse', manyFollowers);
        break;
      case 'brooklyn':
        console.log(chalk.bold.yellow('*~B-~R-~O-~O-~K-~L-~Y-~N-~-~>'));
        socket.emit('brooklynResponse', manyFollowers);
        break;
      case 'manhattan':
        console.log(chalk.bold.cyan('*~M-~A-~N-~H-~A-~T-~T-~A-~N-~-~>'));
        socket.emit('manhattanResponse', manyFollowers);
        break;
      default:
        console.log(chalk.bold.red('*~W-~T-~F-*'));
    }
  });
});


// -~-~-~-~-~-~-~-~-~-~-~-~ LOGGING MIDDLEWARE ~-~-~-~-~-~-~-~-~-~-~-~- \\
// app.use(volleyball);

// -~-~-~-~-~-~-~-~-~-~-~-~ SERVE STATIC ASSETS ~-~-~-~-~-~-~-~-~-~-~-~- \\
app.use(express.static(rootPath));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~- API -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~- \\
app.post('/api/tone', (req, res, next) => {
  toneAnalyzer.tone({text: req.body.text}, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

// -~-~-~-~-~-~-~-~-~-~-~-~-~-~ SERVE IT UP ~-~-~-~-~-~-~-~-~-~-~-~-~-~- \\
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// -~-~-~-~-~-~-~-~-~-~-~-~-~ START THE SERVER ~-~-~-~-~-~-~-~-~-~-~-~-~- \\
server.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});
