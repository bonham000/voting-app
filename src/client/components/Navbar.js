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

            { !isAuthenticated &&
                <button  className = 'navLoginBtn' >
                  <Link to = 'login' className = 'authLink'>Login</Link>
                </button> }

            { !isAuthenticated &&
              <button  className = 'navSignupBtn' >
                <Link to = 'signup' className = 'authLink'>Sign Up</Link>
              </button> }

            { isAuthenticated &&
                <Link to = 'add-poll' className = 'navLink' activeClassName = 'activeRoute'>Add Poll</Link> }

            { isAuthenticated &&
              <button className = 'navLogoutBtn' onClick={ () => dispatch(logoutUser()) }>
                Logout
              </button> }

          </div>
        </div>
    )
  }
}

export default Navbar;