/* eslint-disable import/default */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'
import thunkMiddleware from 'redux-thunk'
import configureStore from './store/configureStore'

import { retrievePolls } from './actions/polls'

// import styles
import './theme/index.scss'

const store = configureStore();

store.dispatch(retrievePolls());



render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
