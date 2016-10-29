import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Chart from '../components/Chart'
import { deletePoll } from '../actions/polls'

function checkResults(array, idx) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === idx) { return true; }
	}
	return false;
}

@connect(
	state => ({
		polls: state.polls,
		auth: state.auth.isAuthenticated
	}),
	dispatch => ({
		delete: bindActionCreators(deletePoll, dispatch)
	})
)
class MyPolls extends React.Component {
	static propTypes = {
		polls: React.PropTypes.array.isRequired,
		auth: React.PropTypes.bool.isRequired,
		delete: React.PropTypes.func.isRequired
	}
	componentWillMount() { if (!this.props.auth) { browserHistory.push('/') } }
	constructor(props) {
		super(props);
		this.state = {
			results: []
		}
		this.removePoll = this.removePoll.bind(this);
		this.toggleResults = this.toggleResults.bind(this);
	}
	removePoll(id) {
		const data = {
			token: localStorage.getItem('id_token'),
			pollID: id
		}
		this.props.delete(data);
	}
	toggleResults(idx) {
		const { results } = this.state;

		let newResults = [];

		if (checkResults(results, idx)) {
			newResults = results.filter( (entry) => {
				return entry !== idx;
			});
		}
		else {
			newResults = [...results, idx]
		}

		this.setState({
			results: newResults
		})
	}
	render() {
		const filteredPolls = this.props.polls.filter( (poll) => {
			return poll.author === localStorage.getItem('user')
		});
		const { results } = this.state
		const renderPolls = filteredPolls.map( (poll, idx) => {
			return (
				<div key = {idx} className = 'pollItemWrapper'>
					<div className = 'pollItem'>
						<h2>{poll.title}</h2>
						<i
							className = "fa fa-caret-square-o-down fa-1x infoOption"
							aria-hidden = "true"
							onClick = {this.toggleResults.bind(this, idx)}>
						</i>
						<i 
	            className = "fa fa-times fa-1x removeOption"
	            aria-hidden = "true"
	            onClick = {this.removePoll.bind(this, poll._id)}>
	          </i>
					</div>
					<div>
						{checkResults(results, idx) && <Chart poll = {poll} /> }
					</div>
				</div>
			);
		});
		return (
			<div className = 'myPollsContainer'>
				<h1>Polls you have created</h1>
				{renderPolls}
			</div>
		);
	}
};

export default MyPolls;