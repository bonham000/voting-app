import React from 'react'
var PieChart = require("react-chartjs").Pie

class Pie extends React.Component {
	render() {
		return (
			<PieChart data = {this.props.chartData}/>
		);
	}
};

export default Pie;