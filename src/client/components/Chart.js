import React from 'react'

class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}

	}
	render() {
		console.log(this.props.poll);
		return (
			<div>
				<h1>Chart Component</h1>
				<p>{this.props.poll.title}</p>
			</div>
		);
	}
};

export default Chart;