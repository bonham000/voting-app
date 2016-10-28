import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { retrievePolls } from '../actions/polls'

@connect (
	state => ({
		polls: state.polls
	}),
	dispatch => ({ 
		loadPolls: bindActionCreators(retrievePolls, dispatch)
	})
)
class ViewPolls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pollData: []
		}
		this.selectOption = this.selectOption.bind(this);
		this.handleVote = this.handleVote.bind(this);
	}
	selectOption(poll, idx) {
		let currentPolls = this.state.polls.slice();
		for (var a = 0; a < currentPolls.length; a++) {
			if (currentPolls[a].title == poll.title) {
				currentPolls[a].selected = idx;
			}
			console.log(currentPolls);
		}
		this.setState({
			polls: currentPolls
		});
	}
	handleVote(poll) {
		if (poll.selected !== '') {
			
			// dispatch vote action here
			console.log(poll);

		}
	}	
	render() {
		const renderPolls = this.props.polls.map( (poll, idx) => {
			const renderOptions = poll.options.map( (option, idx) => {
				return (
					<div className = "optionContainer" key = {idx}>
						<div
							className = "option"
							onClick = {this.selectOption.bind(this, poll, idx)}>
							{option.option}
						</div>
					</div>
				);
			});
			return (
				<div className = "pollWrapper" key = {idx}>
					<h2>{poll.title}</h2>
					{renderOptions}
					<div className = "voteButton" onClick = {this.handleVote.bind(this, poll)}>Cast Your Vote!</div>
				</div>
			);
		});
		return (
			<div className = 'viewPollsContainer'>
				<h1>All Polls</h1>
				{renderPolls}
			</div>
		);
	}
};

export default ViewPolls;