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
		const chartOptions = {
	    segmentShowStroke: false,
	    animateRotate: true,
	    animateScale: false,
	    percentageInnerCutout: 50,
	    tooltipTemplate: "<%= value %>%"
		}
		const text = "https://twitter.com/intent/tweet?text=Vote on " + this.props.poll.title + " at http://localhost:3000!"
		return (
			<div className = 'chartWrapper'>
				<h1>Poll Results
					<a className = 'twitterBtn' target = "_blank" href = {text}>
						<i className="fa fa-twitter" aria-hidden="true"></i>
					</a>
				</h1>
				<Pie chartData = {data} options = {chartOptions} />
			</div>
		);
	}
};

export default Chart;