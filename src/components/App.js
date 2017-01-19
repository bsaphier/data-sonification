import React from 'react';

const App = ({ mainReducer: { title, tweet }, fetchTweets }) => {
  fetchTweets();
  console.log(tweet);
  return (
    <div id="outer-container">
      <h1>{ title }</h1>
      <h3>{tweet ? tweet : null}</h3>
    </div>
  );
};

export default App;
