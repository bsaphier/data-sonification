import React from 'react';

const App = ({
  onConnect,
  killStream,
  fetchTweets,
  dataReducer: {
    locations
  },
  streamReducer: {
    tweet,
    title,
    connected
  }
}) => {
  // const tweetProps = Object.keys(tweet);
  // const tweetData = connected ? tweetProps.map((prop, idx) => (
  //   <div key={tweet.id + String(idx)}>
  //     <p>{`${prop}: ${tweet[prop]}`}</p>
  //   </div>
  // )) : onConnect() && null;

  const places = Object.keys(locations);
  const locationCounters = places.map(place => (
    <div key={place}>
      <p>{`${place}: ${locations[place]}`}</p>
    </div>
  ));

  return (
    <div id="outer-container">
      <h1>{ title }</h1>
      <button type="button" onClick={() => fetchTweets()}>
        Fetch Data
      </button>
      <button type="button" onClick={() => killStream()}>
        Stop Data Stream
      </button>
      { locationCounters }
    </div>
  );
};

export default App;
