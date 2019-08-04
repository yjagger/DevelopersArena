import {GET_ERRORS} from '../actions/types';

const initialState = {
    error: {}
}
//3 --> the reducer returns to the store with new state or old state in case of default.
export default function(state=initialState, action){

    switch(action.type){

        case GET_ERRORS:
            return action.payload;

        default:
            return state;
    }
}