import isEmpty from '../validations/isEmpty'
import {SET_CURRENT_USER} from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: {}
}

//3 --> the reducer returns to the store with new state or old state in case of default.
export default function(state=initialState, action){
    switch(action.type){
        case SET_CURRENT_USER: {
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        }
        default:
            return state;

    }
}