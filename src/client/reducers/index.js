import { combineReducers } from 'redux'
import polls from './polls-reducer'
import auth from './auth-reducer'

export default combineReducers({
  auth,
  polls
});
