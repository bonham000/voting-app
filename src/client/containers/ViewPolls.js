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
	static propTypes = {

	}
	componentWillMount() {
		console.log('sending for polls');
		this.props.loadPolls()
	}
	constructor(props) {
		super(props);
		this.state = {}
	}
	render() {
		console.log('PROPS:', this.props);
		const renderPolls = this.props.polls.polls.map( (poll, idx) => {
			const renderOptions = poll.options.map( (option, idx) => {
				let optionStyle = { background: 'rgb(25,35,45)', color: 'rgb(10,200,50)' }
				if (poll.selected === idx) {
					optionStyle = { background: 'rgb(10,200,50)', color: 'rgb(15,15,15)' }
				}
				return (
					<div className = "optionContainer" key = {idx}>
						<div
							className = "option"
							style = {optionStyle}
							onClick = {this.selectOption.bind(this, poll, idx)}>
							{option.option}
						</div>
					</div>
				);
			});
			return (
				<div className = "pollWrapper" key = {idx}>
					<h2>{poll.title}</h2>
					<hr />
					{renderOptions}
					<div className = "voteButton" onClick = {this.handleVote.bind(this, poll)}>Cast Your Vote!</div>
				</div>
			);
		});
		return (
			<div className = 'viewPollsContainer'>
				<h1>View Polls</h1>
				{renderPolls}
			</div>
		);
	}
};

export default ViewPolls;