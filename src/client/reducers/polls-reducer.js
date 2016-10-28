import axios from 'axios'

import { SAVE_POLLS, retrievePollData, retrievePolls } from '../actions/polls'
//const pollDefault = axios.get('retrieve-polls').then( (response) => { return response.data });

const polls = (state = [], action) => {
  
  switch (action.type) {
  
    case SAVE_POLLS:
      return {
      	polls: action.polls
      }

    default:
      return state;
  
  }
};

export default polls;
