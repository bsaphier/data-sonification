import React from 'react';

const App = ({
  killStream,
  didConnect,
  openStream,
  streamReducer: { connected },
  dataReducer: { locations },
  audioContextProvider: { audioContextAndGraph }
}) => {

  const keys = Object.keys(locations);
  const places = keys.length > 10 ? keys.slice(0, 10) : keys;

  const locationCounters = places.map(
    place => (
      <div key={place}>
        <p>{`${place}: ${locations[place]}`}</p>
      </div>
    )
  );

  if (!connected && !audioContextAndGraph.context) didConnect();

  return (
    <div id="outer-container">
      <button
        type="button"
        onClick={() => openStream(audioContextAndGraph)}
      >
        Strart Stream
      </button>
      <button
        type="button"
        onClick={killStream}
      >
        Stop Stream
      </button>
      <div>
        { locationCounters }
      </div>
    </div>
  );
};

export default App;
