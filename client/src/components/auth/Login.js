import React, { Component } from 'react'
import { connect } from 'react-redux';
import {loginUser} from '../../actions/authActions';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';


export class Login extends Component {

    constructor(){
        super()
        this.state = {
           
            email : '',
            password: '',
            errors: {}
        };

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e){
        this.setState({
                [e.target.name] : e.target.value
        })
    }
    onSubmit(e){
        e.preventDefault();

        var userData = {
            email: this.state.email,
            password: this.state.password
        }

        //console.log(user);

        this.props.loginUser(userData);
    }

    componentDidMount(){

        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps){

        if((nextProps.auth.isAuthenticated)){
            this.props.history.push('/dashboard');
        }
        if(nextProps.errors){
            this.setState({
                errors: nextProps.errors
            })
        }
    }

    render() {
        console.log("in Login Component");
        let {errors} = this.state;
        return (
            <div>
                 <div className="login">
                    <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Log In</h1>
                        <p className="lead text-center">Sign in to your DevConnector account</p>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                            <input type="email" className={classnames("form-control form-control-lg",{"is-invalid":errors.emailError},{"is-invalid":errors.emailError2})} 
                            placeholder="Email Address" name="email" onChange={this.onChange}/>
                            {errors.emailError &&
                                (<div className="invalid-feedback">Incorrect UserName/Password
                                </div>)}
                                {errors.emailError2 &&
                                (<div className="invalid-feedback">Incorrect UserName/Password
                                </div>)}
                            </div>
                            <div className="form-group">
                            <input type="password" className={classnames("form-control form-control-lg", {"is-invalid":errors.passwordError})}placeholder="Password" name="password" onChange={this.onChange}/>
                            {errors.passwordError  &&
                                (<div className="invalid-feedback">Incorrect UserName/Password
                                </div>)}
                            </div>
                            <input type="submit" className="btn btn-info btn-block mt-4" />
                            <div className="form-group">
                            {!errors.passwordError && !errors.emailError &&
                            (<div className="valid-feedback">looks good!
                            </div>)}
                            {!errors.passwordError && !errors.error &&
                            (<div className="invalid-feedback">uh oh! Some problem occurred
                            </div>)}
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {

    loginUser:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired

}


const mapStateToProps = (state) => ({

    auth: state.auth,
    errors: state.errors

});

export default connect(mapStateToProps,{loginUser})(withRouter(Login))
