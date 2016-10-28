import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { bindActionCreators } from 'redux'

import { retrievePolls } from '../actions/polls'

@connect(
	state => ({
		isAuthenticated: state.auth.isAuthenticated
	}),
	dispatch => ({ 
		loadPolls: bindActionCreators(retrievePolls, dispatch)
	})
)
class About extends React.Component {
	 constructor(props) {
    super(props);
  }
   componentWillMount() {
    this.props.loadPolls()
  }
 	render() {
 		return (
		  <div>
		    <h3>Welcome to the Free Code Camp Voting App</h3>

		    { !this.props.isAuthenticated && <div>
		    	<h4>Please login or sign up to add some data.</h4>
		    </div> }

				{ this.props.isAuthenticated && <div>
					<p>Welcome {localStorage.getItem('user')}</p>
					</div> }

		  </div>
	  );
 	}
}
export default About;
