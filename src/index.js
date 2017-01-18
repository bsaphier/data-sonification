import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
import rootReducer from './reducer';

const store = createStore( rootReducer );

ReactDOM.render(
  <Provider store={ store }>
    <AppContainer />
  </Provider>,
  document.getElementById('app')
);
