import React from 'react';

const App = ({ mainReducer: { title }, fetchTrafficData }) => (
  <div id="outer-container">
    <h1>{ title }</h1>
    <button type="button" onClick={fetchTrafficData}>Fetch Data</button>
  </div>
);

export default App;
