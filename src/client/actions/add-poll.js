import axios from 'axios'

export function submitNewPoll(poll, token) {
	return dispatch => {
		return axios.post('http://localhost:3000/api/add-poll', {
			poll,
			token,
		});
	}
}