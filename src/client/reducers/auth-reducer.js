import { combineReducers } from 'redux'

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, NEW_SIGNUP, REGISTRATION_ERROR } from '../actions/login'
import { LOGOUT_SUCCESS } from '../actions/logout'
import { INVALID_REQUEST } from '../actions/auth'

const defaultState = {
  loginError: '',
  registrationError: '',
  permissionsError: '',
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token') ? true : false
}

const auth = (state = defaultState, action) => {

  switch (action.type) {
  
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      });
  
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        loginError: '',
        registrationError: '',
        permissionsError: ''
      });
  
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        loginError: action.error
      });
   
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
  
    case NEW_SIGNUP:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.user
      });

    case REGISTRATION_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        registrationError: action.error
      });

    case INVALID_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        permissionsError: action.error
      });
 
    default:
      return state;

  }
}

export default auth;