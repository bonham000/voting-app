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
		}).catch(err => {
			dispatch(invalidRequest(err.response.data));
			setTimeout( () => {
				dispatch(logoutUser())
			}, 1000);
		});
			
	}
}