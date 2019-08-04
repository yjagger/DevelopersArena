import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {registerUser} from '../../actions/authActions'

class Register extends Component {

    constructor(){
        super()
        this.state = {
            name : '',
            email : '',
            password: '',
            password2: '',
            errors: {}
        };

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e){
        
        this.setState({
            [e.target.name] : e.target.value,
        })
    }
    onSubmit(e){
        e.preventDefault();

        var newUser = {
            name: this.state.name,
            email : this.state.email,
            password : this.state.password,
            password2: this.state.password2
        }

        //0 --> invoking action with the payload and history to redirect from outside component
        this.props.registerUser(newUser, this.props.history);


    }

    componentDidMount(){

        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard');
        }
    }

    //5 --> This lifecycle method is invoked when props are receieved
    componentWillReceiveProps(nextProps){

        if(nextProps.errors){
            this.setState({errors: nextProps.errors});
        }

    }

    render() {
        console.log("in Register component")
        const { errors } = this.state;


        return (
            <div>
               <div className="register">
                    <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Sign Up</h1>
                        <p className="lead text-center">Create your DevConnector account</p>
                        <form onSubmit= {this.onSubmit}>
                        <div className="form-group">
                        <input type="text" 
                        className={classnames('form-control form-control-lg', 
                            {'is-invalid':errors.nameError1}, {'is-invalid':errors.nameError2}
                        )}
                        placeholder="Name" 
                        name="name" 
                        value={this.state.name} 
                        required onChange= {this.onChange}/>
                        </div>
                        
                        <div className="form-group">
                        <input type="email" 
                        className={classnames('form-control form-control-lg', 
                        {'is-invalid':errors.emailError}, {'is-invalid':errors.emailError2}
                        )}
                        placeholder="Email Address" 
                        name="email" 
                        value={this.state.email}
                        onChange= {this.onChange}
                        />
                            {errors.emailError && (<div className="invalid-feedback">{errors.emailError}</div>)}
                            {errors.emailError2 && (<div className="invalid-feedback">{errors.emailError2}</div>)}
                        <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                        </div>

                        <div className="form-group">
                        <input type="password"  className={classnames('form-control form-control-lg', 
                        {'is-invalid':errors.passwordError}, {'is-invalid':errors.passwordError2}
                        )}  
                        placeholder="Password" 
                        name="password" 
                        value={this.state.password} 
                        onChange= {this.onChange} />
                            {errors.passwordError && (<div className="invalid-feedback">{errors.passwordError}</div>)}
                            {errors.passwordError2 && (<div className="invalid-feedback">{errors.passwordError2}</div>)}
                        </div>

                        <div className="form-group">
                        <input type="password" 
                        className={classnames('form-control form-control-lg', 
                            {'is-invalid':errors.passwordError3},{'is-invalid':errors.passwordError4}
                        )} 
                        placeholder="Confirm Password" 
                        name="password2" 
                        value={this.state.password2} 
                        onChange= {this.onChange} />
                            {errors.passwordError3 && (<div className="invalid-feedback">{errors.passwordError3}</div>)}
                            {errors.passwordError4 && (<div className="invalid-feedback">{errors.passwordError4}</div>)}
                        </div>
                        
                        <input type="submit" className="btn btn-info btn-block mt-4" />
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

//4 --> when the store returns the 'state', then mapStateToProps function makes
//state available as props in the component
const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

//1 --> registers action registerUser with store.
//withRouter(Register) allows the component routing enabled from outside the component 
export default connect(mapStateToProps, {registerUser})(withRouter(Register));
