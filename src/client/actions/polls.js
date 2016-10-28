import axios from 'axios'
import { browserHistory } from 'react-router'

import { invalidRequest } from './auth'
import { logoutUser } from './logout'

export function submitNewPoll(poll, token) {
	return dispatch => {
		return axios.post('http://localhost:3000/api/add-poll', {
			poll,
			token,
		}).then( () => {
			browserHistory.push('/')
			return dispatch(retrievePolls());
		}).catch(err => {
			dispatch(invalidRequest(err.response.data));
			setTimeout( () => {
				dispatch(logoutUser())
			}, 1000);
		});
	}
};

export const VOTE_SUBMITTED = 'VOTE_SUBMITTED'

function voteSubmitted(data) {
	return {
		type: VOTE_SUBMITTED,
		data
	}
}

export function submitVote(vote) {
	return dispatch => {
		axios.post('/api/submit-vote', vote).then( (response) => {
			// need to show view page here
			browserHistory.push('/');
			return dispatch(retrievePolls(response.data));
		});
	}
}

export const SAVE_POLLS = 'SAVE_POLLS'

function retrievePollData(polls) {
	return {
		type: SAVE_POLLS,
		polls,
	}
}

export function retrievePolls() {
	return dispatch => {
		axios.get('/api/retrieve-polls').then( (response) => {
			return dispatch(retrievePollData(response.data));
		});
	}
}