import React from 'react'
import { connect } from 'react-redux'

@connect(state => ({ polls: state.polls }))
class MyPolls extends React.Component {
	render() {
		const filteredPolls = this.props.polls.filter( (poll) => {
			return poll.author === localStorage.getItem('user')
		});
		const renderPolls = filteredPolls.map( (poll, idx) => {
			return (
				<div key = {idx} className = 'pollItem'>
					<h2>{poll.title}</h2>	
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