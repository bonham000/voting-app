
export const INVALID_REQUEST = 'INVALID_REQUEST';

export function invalidRequest(error) {
	console.log(error)
	return {
		type: INVALID_REQUEST,
		isFetching: false,
		isAuthenticated: false,
		error
	}
}