import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { deletePoll } from '../actions/polls'

@connect(
	state => ({
		polls: state.polls
	}),
	dispatch => ({
		delete: bindActionCreators(deletePoll, dispatch)
	})
)
class MyPolls extends React.Component {
	static propTypes = {
		polls: React.PropTypes.array.isRequired,
		delete: React.PropTypes.func.isRequired
	}
	constructor(props) {
		super(props);
		this.removePoll = this.removePoll.bind(this);
	}
	removePoll(id) {
		const data = {
			token: localStorage.getItem('id_token'),
			pollID: id
		}
		this.props.delete(data);
	}
	render() {
		const filteredPolls = this.props.polls.filter( (poll) => {
			return poll.author === localStorage.getItem('user')
		});
		const renderPolls = filteredPolls.map( (poll, idx) => {
			return (
				<div key = {idx} className = 'pollItem'>
					<h2>{poll.title}</h2>
					<i 
            className = "fa fa-times fa-1x removeOption"
            aria-hidden = "true"
            onClick = {this.removePoll.bind(this, poll._id)}>
          </i>
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