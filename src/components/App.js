import React from 'react';

const App = ({
  killStream,
  didConnect,
  openStream,
  toneDidChange,
  streamReducer: { connected },
  dataReducer: { joy, fear, anger, negative, locations },
  audioContextProvider: { audioContextAndGraph }
}) => {
  if (!connected && !audioContextAndGraph.context) didConnect();

  // let joy = true;
  const keys = Object.keys(locations);
  const places = keys.length > 10 ? keys.slice(0, 10) : keys;

  const locationCounters = places.map(
    place => (
      <div key={place}>
        <p>{`${place}: ${locations[place]}`}</p>
      </div>
    )
  );

  const positivity = joy - anger - fear;

  if (negative) toneDidChange(positivity > 0);


  return (
    <div id="outer-container">
      <h1>DATA SONIFICATION</h1>
      <button
        type="button"
        onClick={() => openStream(audioContextAndGraph, positivity)}
      >
        Strart Stream
      </button>
      <button
        type="button"
        onClick={killStream}
      >
        Stop Stream
      </button>
      <h2>{ `Positivity Meter: ${positivity}` }</h2>
      <div>
        <p>{`Joy: ${joy}`}</p>
        <p>{`Fear: ${fear}`}</p>
        <p>{`Anger: ${anger}`}</p>
      </div>
      <hr />
      <div>{ locationCounters }</div>
    </div>
  );
};

export default App;
