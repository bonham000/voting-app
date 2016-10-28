import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { submitNewPoll } from '../actions/add-poll'

class AddPoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      options: ['']
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.submitPoll = this.submitPoll.bind(this);
  }
  handleKeyPress(key) {

    if (key.keyCode === 9) {
      let elem = document.activeElement;
      let lastOption = this.state.options.length - 1;
      if (elem.name.substr(-1) == lastOption && elem.value !== '') {
        // if user presses tab on the last current option, create a new option for them
        this.addOption();
      }
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  changeOption(event) {
    let options = this.state.options.slice();
    let optionIdx = event.target.name.substr(-1);

    options[optionIdx] = event.target.value;

    this.setState({
      options: options
    });

  }
  addOption() {
    let { options } = this.state;
    options.push('');

    this.setState({
      options: options
    });

  }
  removeOption(idx) {
    let { options } = this.state;
    // User cannot delete first option if it is the only option
    if (options.length !== 1 || idx !== 0) {
      options.splice(idx, 1);
      this.setState({
        options: options
      });
    }
  }
  submitPoll() {
    let { title, options } = this.state;

    options = options.filter( (item) => {
      return item !== ''
    });

    if (title !== '' && options) {

      let pollOptions = [];
      // Add a votes category associated with each option
      for (var i = 0; i < options.length; i++) {
        pollOptions.push({
          option: options[i],
          votes: 0,
        });
      }

      const pollData = {
        title: title,
        options: pollOptions,
        selected: ''
      }

      // Poll is ready to go and can be packaged into an object for the server:
      console.log("Sending new poll object to server to be saved");

      const token = localStorage.getItem('id_token') ? localStorage.getItem('id_token') : '';

      console.log('token:', token);

      this.props.submitNewPoll(pollData, token).then( (response) => {
        console.log('poll submited!');
        browserHistory.push('/');
      });

    }
  }
  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }
  render() {
    const { options } = this.state;
    const renderOptions = options.map( (opt, idx) => {
      let name = "option " + idx;
      return (
        <div key = {idx} className = "optionContainer">
          <input
            className = "optionInput"
            name = {name}
            type = "text"
            placeholder = "Enter an Option Here"
            value = {this.state.options[idx]}
            onChange = {this.changeOption} />
          <i 
            className = "fa fa-times fa-3x removeOption"
            aria-hidden="true"
            onClick = {this.removeOption.bind(this, idx)}>
          </i>
        </div>
      );
    });
    return (
      <div className = "addPollWrapper">
        <h1>Add a New Poll</h1>
          <p>Poll Title:</p>
            <input
              className = "titleInput"
              type = "text" 
              name = "title"
              placeholder = "Enter Title Here"
              value = {this.state.title}
              onChange = {this.handleChange} />
              <p>Poll Options:</p>
              {renderOptions}
            <br /><br />
          <button className = 'addBtn' onClick = {this.addOption}>Add Option</button>
        <button className = 'submitBtn' onClick = {this.submitPoll}>Submit New Poll</button>
      </div>
    );
  }
};

AddPoll.propTypes = {
  submitNewPoll: React.PropTypes.func.isRequired
}

export default connect(null, { submitNewPoll } )(AddPoll);