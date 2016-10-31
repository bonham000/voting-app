import axios from 'axios'
import { browserHistory } from 'react-router'

import { invalidRequest } from './auth'
import { logoutUser } from './logout'

// https://blooming-beach-19422.herokuapp.com/

export function submitNewPoll(poll, token) {
	return dispatch => {
		return axios.post('http://localhost:3000/api/add-poll', {
			poll,
			token,
		}).then( () => {
			return dispatch(retrievePolls());
		}).catch(err => {
			dispatch(invalidRequest(err.response.data));
			setTimeout( () => {
				dispatch(logoutUser())
			}, 2000);
		});
	}
};

export function addOption(poll, option, token) {
	const data = {
		poll,
		option,
		token,
	}
	return dispatch => {
		axios.post('http://localhost:3000/api/add-option', data).then( (response) => {
			browserHistory.push('/view-polls')
			dispatch(retrievePolls());
		}).catch(err => console.log(err.response.data));
	}
}

export const VOTE_SUBMITTED = 'VOTE_SUBMITTED'

function voteSubmitted(data) {
	return {
		type: VOTE_SUBMITTED,
		data
	}
}

export function submitVote(vote) {
	return dispatch => {
		axios.post('http://localhost:3000/api/submit-vote', vote).then( (response) => {
			return dispatch(retrievePolls())
		}).catch(error => {
			alert(error.response.data);
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
		axios.get('http://localhost:3000/api/retrieve-polls').then( (response) => {
			browserHistory.push('/');
			return dispatch(retrievePollData(response.data));
		});
	}
}

export function deletePoll(data) {
	return dispatch => {
		axios.post('http://localhost:3000/api/delete-poll', data).then( (response) => {
			return dispatch(retrievePolls(response.data));
		});
	}
}