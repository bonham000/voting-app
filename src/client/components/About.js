import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

@connect(
	state => ({
		isAuthenticated: state.auth.isAuthenticated
	})
)
class About extends React.Component {
	 constructor(props) {
    super(props);
    this.navigateCounter = this.navigateCounter.bind(this);
  }
  navigateCounter() {

    if (this.props.isAuthenticated) {
      browserHistory.push('/counter');
    }
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
