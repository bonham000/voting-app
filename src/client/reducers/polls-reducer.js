
import { SAVE_POLLS } from '../actions/polls'

const polls = (state = [], action) => {
  
  switch (action.type) {
  
    case SAVE_POLLS:
    	console.log(action);
      return {
      	polls: action.polls
      }

    default:
      return state;
  
  }
};

export default polls;
