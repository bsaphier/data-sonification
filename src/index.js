import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducer';
import AppContainer from './containers/AppContainer';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger({ collapsed: true })
  )
);

render(
  <Provider store={ store }>
    <AppContainer />
  </Provider>,
  document.getElementById('app')
);
