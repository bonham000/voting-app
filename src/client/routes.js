import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'
import About from './components/About'

// Auth Routes
import LoginPage from './containers/LoginPage'
import SignupPage from './containers/SignupPage'

// Poll Routes
import AddPoll from './containers/AddPoll'
import ViewPolls from './containers/ViewPolls'

export default (
  <Route name = 'home' component = {App}>
  	<Route path = '/' name = 'about' component = {About} />
  	<Route path = 'login' name = 'login' component = {LoginPage} />
  	<Route path = 'signup' name = 'signup' component = {SignupPage} />
  	<Route path = 'view-polls' name = 'view-polls' component = {ViewPolls} />
    <Route path = 'add-poll' name = 'add-poll' component = {AddPoll} />
  </Route>
);
