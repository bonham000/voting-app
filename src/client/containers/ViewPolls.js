import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Chart from '../components/Chart'
import AddOption from '../components/AddOption'

import { submitVote } from '../actions/polls'
import { addOption } from '../actions/polls'

function checkResults(array, idx) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === idx) { return true; }
	} return false;
}

@connect (
	state => ({
		polls: state.polls,
		isAuthenticated: state.auth.isAuthenticated
	}),
	dispatch => ({ 
		dispatchVote: bindActionCreators(submitVote, dispatch),
		addOption: bindActionCreators(addOption, dispatch)
	})
)
class ViewPolls extends React.Component {
	static propTypes = {
		polls: PropTypes.array.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		dispatchVote: PropTypes.func.isRequired,
		addOption: PropTypes.func.isRequired
	}
	constructor(props) {
		super(props);
		this.state = {
			results: [],
			addOptions: [],
			selected: {}
		}
		this.selectOption = this.selectOption.bind(this);
		this.handleVote = this.handleVote.bind(this);
		this.addOption = this.addOption.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
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
			selectedOption: selected[poll._id],
			user: localStorage.getItem('user') !== '' ? localStorage.getItem('user') : ''
		}
		// dispatch vote action here
		this.props.dispatchVote(vote);
		this.setState({
			results: [],
			addOptions: [],
			selected: {}
		});
	}
	addOption(poll, option, idx) {
		if (option !== '') {
			const token = localStorage.getItem('id_token');
			// dispatch add option action here
			this.props.addOption(poll, option, token);

			const { addOptions } = this.state;
			let newAddOptions = addOptions.filter( (entry, idx) => {
				return entry !== idx;
			});
			this.setState({ addOptions: newAddOptions });

		}
	}
	toggleMenu(idx, targetState) {
		
		const { results, addOptions } = this.state;

		let newResults = [];
		let newAddOptions = [];

		// toggle menu state for result and add poll options separately for all polls
		if (targetState === 'results' && checkResults(results, idx)) {
			newResults = results.filter( (entry) => { return entry !== idx; });
			newAddOptions = addOptions;
		}
		else if (targetState === 'results') {
			newResults = [...results, idx]
			newAddOptions = addOptions.filter( (entry) => { return entry !== idx; });
		}
		else if (targetState === 'add' && checkResults(addOptions, idx)) {
			newAddOptions = addOptions.filter( (entry) => { return entry !== idx; });
			newResults = results;
		}
		else {
			newAddOptions = [...addOptions, idx];
			newResults = results.filter( (entry) => { return entry !== idx; });
		}

		if (targetState === 'results') { this.setState({ results: newResults, addOptions: newAddOptions }) }
		else if (targetState === 'add') { this.setState({ results: newResults, addOptions: newAddOptions }) }

	}
	render() {
		let selected = this.state.selected;
		const { polls } = this.props;
		const renderPolls = polls.map( (poll, idx) => {
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
			const { results, addOptions } = this.state;
			return (
				<div className = "pollWrapper" key = {idx}>
					<h2>{poll.title}</h2>
					{checkResults(results, idx) && <Chart poll = {poll} /> }
					{renderOptions}
					{this.props.isAuthenticated && <div className = "optionContainer" key = {idx}>
						<div
							className = "option addOption"
							onClick = {this.toggleMenu.bind(this, idx, 'add')}>
							Don't like the choices? Add a new one!
						</div>
					</div>}
						<button
							className = "voteBtn"
							onClick = {this.handleVote.bind(this, poll)}>
							Cast Your Vote!
						</button>
						<button
							className = "resultsBtn"
							onClick = { this.toggleMenu.bind(this, idx, 'results')}>
							{ checkResults(results, idx) ? 'Hide' : 'View' } Results
						</button>
					{checkResults(addOptions, idx) && <AddOption poll = {poll} idx = {idx} AddOption = {this.addOption} /> }
				</div>
			);
		});
		return (
			<div className = 'viewPollsContainer'>
				{renderPolls}
			</div>
		);
	}
};

export default ViewPolls;