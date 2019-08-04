// Register
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import {setAuthToken} from '../utils/setAuthToken';
import {GET_ERRORS} from './types';
import {SET_CURRENT_USER} from './types';


//2--> Store dispatches the action to the reducer functions which are registered and have 
//corresponding type.
export const registerUser = (userData, history) => dispatch => {
      
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })) 
};

export const loginUser = (userData) => dispatch => {

    axios
        .post('/api/users/login', userData)
        .then(res => {
                //save to local storage
            const {token} = res.data;
                //set to local storage
            localStorage.setItem('jwtToken', token)
                //set token to Auth header
            setAuthToken(token)
                //Decode token to get user data
            const decoded = jwt_decode(token)
                // set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
};

//set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logOutUser = history => dispatch => {

    //Remove token from local Storage
        localStorage.removeItem('jwtToken');
    //Remove Auth header for every requests
        setAuthToken(false);
    //remove token from the store
        dispatch(setCurrentUser({}));
    //redirect to logout page
        history.push('/login')
}