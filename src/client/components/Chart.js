import React from 'react'

class Chart extends React.Component {
	static propTypes = {
		poll: React.PropTypes.object.isRequired
	}
	constructor(props) {
		super(props);
		this.state = {}
	}
	render() {
		return (
			<div className = 'chartWrapper'>
				<h1>Poll Results:</h1>
				<p>{this.props.poll.title}</p>
			</div>
		);
	}
};

export default Chart;