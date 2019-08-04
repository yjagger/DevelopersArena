import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import {setAuthToken} from './utils/setAuthToken'
import {setCurrentUser} from './actions/authActions';
import {logOutUser} from './actions/authActions';
import store from './store';
//eslint-disable-next-line
//import logo from './logo.svg';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


//logic for setting the jwt token on redux store for page refreshes or browser close
//check for token,
if(localStorage.jwtToken){
  //set Auth token Header
setAuthToken(localStorage.jwtToken)
  //decode token 
const decoded = jwt_decode(localStorage.jwtToken);
  //store the token in the redux store by dispatching the action.
store.dispatch(setCurrentUser(decoded))
  //check for expired token
const currentTime = Date.now() / 1000
if(currentTime > decoded.exp){
  //logout User
  store.dispatch(logOutUser());
  //TODO: CLear current profile

  //Redirect to login
  window.location.href="/login";
}
}

function App() {
  return (
    <Provider store ={store}>
    <Router>
      <div className = "App">
        <Navbar/>

          <Route exact path="/" component = {Landing} />

          <Route exact path ="/landing" component = {Landing} />

          <Route exact path = "/register" component = {Register} />

          <Route exact path = "/login" component = {Login} />

          <Footer/>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
