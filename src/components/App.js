import React from 'react';

const App = ({
  killStream,
  didConnect,
  openStream,
  dataReducer,
  togglePositivity,
  streamReducer: { connected },
  audioContextProvider: { audioContextAndGraph }
}) => {
  if (!connected && !audioContextAndGraph.context) didConnect();

  const keys = Object.keys(dataReducer.locations);
  const places = keys.length > 10 ? keys.slice(0, 10) : keys;

  const locationCounters = places.map(
    place => (
      <div key={place}>
        <p>{`${place}: ${dataReducer.locations[place]}`}</p>
      </div>
    )
  );

  if (!dataReducer.lowPositivity && dataReducer.positivity < 0.5) {
    togglePositivity(dataReducer);
  } else if (dataReducer.lowPositivity && dataReducer.positivity > 0.5) {
    togglePositivity(dataReducer);
  }

  return (
    <div id="outer-container">
      <h1>DATA SONIFICATION</h1>
      <button
        type="button"
        onClick={() => openStream(audioContextAndGraph, dataReducer)}
      >
        Strart Stream
      </button>
      <button
        type="button"
        onClick={killStream}
      >
        Stop Stream
      </button>
      <h2>{ `Positivity Meter: ${Number(dataReducer.positivity)}` }</h2>
      <h2>{ `Positivity is Low: ${dataReducer.lowPositivity}` }</h2>
      <h2>{ audioContextAndGraph.audioNodes.delaySend && `delay send : ${audioContextAndGraph.audioNodes.delaySend.gain.value}` }</h2>
      <div>
        <p>{`Joy: ${dataReducer.joy}`}</p>
        <p>{`Fear: ${dataReducer.fear}`}</p>
        <p>{`Anger: ${dataReducer.anger}`}</p>
        <p>{`Sadness: ${dataReducer.sadness}`}</p>
      </div>
      <hr />
      <div>{ locationCounters }</div>
    </div>
  );
};

export default App;
