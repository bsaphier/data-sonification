# data-sonification

to run this on your local machine you need to create two files:
'twitter.config.js' - contains your twitter API access tokens
'watson.config.js'  - contains your Watson API access tokens

structured like this:
```
/* twitter.config.js */
module.exports = {
  consumer_key: 'YOUR-KEY',
  consumer_secret: 'YOUR-SECRET',
  token: 'YOUR-TOKEN',
  token_secret: 'YOUR-TOKEN-SECRET'
};
```
```
/* watson.config.js */
module.exports = {
  username: 'USERNAME_KEY',
  password: 'PASSWORD',
  version: 'VERSION',
  version_date: 'DATE'
};
```

This experiment in data sonification uses the public stream of tweets provided by the Twitter API. Each tweet is categorized by borough (of NYC) and sent to the IBM-Watson Tone Analyzer API to have its "emotional tone" analyzed.

The tweet data is sent to the front end via socket.io where it updates the react-redux store and generates sound.
