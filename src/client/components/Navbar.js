import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { logoutUser } from '../actions/logout'

class Navbar extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
  }
  render() {
    const { dispatch, isAuthenticated, errorMessage } = this.props
    return (
        <div className = "navigationWrapper">
          <div className = "linksWrapper">

            <Link to = '/' className = 'navLink' activeClassName = 'activeRoute'>Home</Link>

            { isAuthenticated &&
              <Link to = 'add-poll' className = 'navLink' activeClassName = 'activeRoute'>Add Poll</Link> }

              <Link to = 'view-polls' className = 'navLink' activeClassName = 'activeRoute'>View Polls</Link>

            { isAuthenticated &&
              <Link to = 'my-polls' className = 'navLink' activeClassName = 'activeRoute'>My Polls</Link> }                              

            { isAuthenticated &&
              <Link to = '#' className = 'navLink' onClick = { () => dispatch(logoutUser()) }>Logout</Link> }

            { !isAuthenticated &&
              <Link to = 'login' className = 'navLink' activeClassName = 'activeRoute'>Login</Link> }

            { !isAuthenticated &&
              <Link to = 'signup' className = 'navLink' activeClassName = 'activeRoute'>Sign Up</Link> }

          </div>
        </div>
    )
  }
}

export default Navbar;