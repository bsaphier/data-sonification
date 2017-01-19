import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import AppContainer from './containers/AppContainer';
import rootReducer from './reducer';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware)
);

render(
  <Provider store={ store }>
    <AppContainer />
  </Provider>,
  document.getElementById('app')
);
