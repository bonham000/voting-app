import React from 'react'

import Pie from './Pie'

class Chart extends React.Component {
	static propTypes = {
		poll: React.PropTypes.object.isRequired
	}
	constructor(props) {
		super(props);
		this.state = {}
	}
	render() {
		const data = this.props.poll.options.map( (option) => {
			return {
				value: option.votes,
				label: option.option
			}
		});
		return (
			<div className = 'chartWrapper'>
				<h1>Poll Results:</h1>
				<Pie chartData = {data} />
			</div>
		);
	}
};

export default Chart;