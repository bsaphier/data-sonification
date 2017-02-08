# data-sonification

This experiment in data sonification begins by tapping into Twitter's public stream of tweets, filtered by location (NYC), each tweet is categorized by borough and sent to the IBM-Watson Tone Analyzer API to have it's "emotional tone" analyzed.

The analyzed tweet is sent client-side via socket.io and updating a react-redux store where all the sound is generated live, with the WebAudio API (using react-redux-webaudio).

Some of the parameters that define the sound are the location, follower count of the person tweeting and the accumulating emotional tone of all the tweets received.
