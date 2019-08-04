import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {logOutUser} from '../../actions/authActions';



export class Navbar extends Component {

    onLogoutClick(e){
        e.preventDefault();
        this.props.logOutUser(this.props.history);
    }
    render() {
        const {isAuthenticated, user} = this.props.auth;

        const authLink = (
            <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <a
                className="nav-link"
                href="#" onClick={this.onLogoutClick.bind(this)} >
                <img 
                className="rounded-circle"
                src={user.avatar} 
                alt={user.name} 
                style={{width: '25px', marginRight: '5px' }} 
                title="You must have a gravatar connected to your email to dispay an image">
                </img>
                {' '}
                Logout
                </a>
            </li>
            </ul>
        );

        const guestLink = (
            <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="register">Sign Up</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="login">Login</Link>
            </li>
            </ul>
        );
        return (
            <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
                <div className="container">
                <Link className="navbar-brand" exact to="/">DevConnector</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mobile-nav">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/profiles"> 
                        {' '}
                        Developers
                        </Link>
                    </li>
                    </ul>
                {isAuthenticated ? authLink : guestLink}
                </div>
                </div>
            </nav>
        </div>
        )
    }
}

Navbar.propTypes = {
    logOutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logOutUser})(withRouter(Navbar))

