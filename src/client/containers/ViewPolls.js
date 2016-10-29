import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { submitVote } from '../actions/polls'
import Chart from '../components/Chart'

function checkResults(array, idx) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === idx) { return true; }
	}
	return false;
}

@connect (
	state => ({
		polls: state.polls
	}),
	dispatch => ({ 
		dispatchVote: bindActionCreators(submitVote, dispatch)
	})
)
class ViewPolls extends React.Component {
	static propTypes = {
		polls: PropTypes.array.isRequired,
		dispatchVote: PropTypes.func.isRequired
	}
	constructor(props) {
		super(props);
		this.state = {
			results: [],
			selected: {}
		}
		this.selectOption = this.selectOption.bind(this);
		this.handleVote = this.handleVote.bind(this);
		this.toggleResults = this.toggleResults.bind(this);
	}
	selectOption(poll, idx) {
		const { selected } = this.state;
		let newSelected = Object.assign({}, this.state.selected, {[poll._id]: idx})

		if (selected[poll._id] === idx) { delete newSelected[poll._id] }
		
		this.setState({ selected: newSelected });
	}
	handleVote(poll) {
		// find selected option
		const { selected } = this.state;
		const vote = {
			id: poll._id,
			selectedOption: selected[poll._id]
		}
		// dispatch vote action here
		this.props.dispatchVote(vote);
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
		let selected = this.state.selected;
		const renderPolls = this.props.polls.map( (poll, idx) => {
			const renderOptions = poll.options.map( (option, idx) => {
				let optionStyle = { background: 'rgba(250,250,250,0.65)' }
				if (!isNaN(selected[poll._id]) && selected[poll._id] == idx) { optionStyle = { background: '#FFE66D' } }
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
			const { results } = this.state;
			return (
				<div className = "pollWrapper" key = {idx}>
					<h2>{poll.title}</h2>
					{renderOptions}
					<button className = "voteBtn" onClick = {this.handleVote.bind(this, poll)}>Cast Your Vote!</button>
					<button className = "resultsBtn" onClick = {this.toggleResults.bind(this, idx)} >{ checkResults(results, idx) ? 'Hide' : 'View' } Results</button>
					{checkResults(results, idx) && <Chart poll = {poll} /> }
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