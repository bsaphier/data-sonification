import React from 'react';

const App = ({
  killStream,
  didConnect,
  fetchTweets,
  streamReducer: { connected },
  dataReducer: { locations },
  audioContextProvider: { audioContextAndGraph }
}) => {

  const places = Object.keys(locations);

  const locationCounters = places.map(
    place => (
      <div key={place}>
        <p>{`${place}: ${locations[place]}`}</p>
      </div>
    )
  );

  if (!audioContextAndGraph.context) didConnect();

  return (
    <div id="outer-container">
      <button type="button" onClick={() => fetchTweets(audioContextAndGraph)}>
        Strart Stream
      </button>
      <button type="button" onClick={killStream}>
        Stop Stream
      </button>
      <div>
        { locationCounters }
      </div>
    </div>
  );
};

export default App;
