import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { bindActionCreators } from 'redux'

import { retrievePolls } from '../actions/polls'

@connect(state => ({ isAuthenticated: state.auth.isAuthenticated }))
class About extends React.Component {
	 constructor(props) {
    super(props);
  }
 	render() {
 		return (
		  <div className = 'aboutWrapper'>
		    <h3>Welcome to the Free Code Camp Voting App</h3>

		    { !this.props.isAuthenticated && <div>
		    	<h4>Please login or sign up to add new polls.</h4>
		    </div> }

				{ this.props.isAuthenticated && <div>
					<p>Welcome {localStorage.getItem('user')}, this app allows you to create polls and share them with your friends.
							You must sign it to add new polls, but anyone can vote on existing polls.</p>
					</div> }

		  </div>
	  );
 	}
}
export default About;
