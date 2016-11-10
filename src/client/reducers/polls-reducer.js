import axios from 'axios'

import { SAVE_POLLS, retrievePollData, retrievePolls } from '../actions/polls'

const polls = (state = [], action) => {
  
  switch (action.type) {
  
    case SAVE_POLLS:
      return action.polls;

    default:
      return state;
  
  }
};

export default polls;
