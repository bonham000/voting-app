import React from 'react'

class AddOption extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			option: ''
		}
		this.handleInput = this.handleInput.bind(this);
	}
	handleInput(e) {
		this.setState({
			option: e.target.value
		});
	}
	render() {
		return (
			<div className = 'addOptionWrapper'>
				<h1>Add a New Option:</h1>
				<input
          className = "optionInput"
          name = "add option"
          type = "text"
          value = {this.state.option}
          onChange = {this.handleInput}
          placeholder = "Enter Another Option Here" />
        <button
        	className = 'addOptionBtn'
        	onClick = {this.props.AddOption.bind(this, this.props.poll, this.state.option, this.props.idx)}>
        	Submit New Option
        </button>
			</div>
		);
	}
};

export default AddOption;