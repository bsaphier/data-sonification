# data-sonification

if you are trying to run this on your local machine, you will need to add two files to it's root directory. One called 'twitter.config.js' that contains your twitter API access tokens, and one called 'watson.config.js' that contains your Watson API access tokens. they should look something like this:
```
/* twitter.config.js */
module.exports = {
  consumer_key: 'your-Key',
  consumer_secret: 'your-Secret',
  token: 'your-token',
  token_secret: 'your-token-secret'
};
```
```
/* watson.config.js */
module.exports = {
  username: 'username-key',
  password: 'password',
  version: 'v3',
  version_date: '2016-05-19'
};
```

This experiment in data sonification begins by tapping into Twitter's public stream of tweets, filtered by location (NYC), each tweet is categorized by borough and sent to the IBM-Watson Tone Analyzer API to have it's "emotional tone" analyzed.

The analyzed tweet is sent client-side via socket.io and updating a react-redux store where all the sound is generated live, with the WebAudio API (using react-redux-webaudio).

Some of the parameters that define the sound are the location, follower count of the person tweeting and the accumulating emotional tone of all the tweets received.
