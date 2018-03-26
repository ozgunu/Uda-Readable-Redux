import { combineReducers } from 'redux';

function doSomething (state = {}, action) { 
    return state; 
}

function doSomethingElse (state = {}, action) {
    return state;
}

export default combineReducers({
    doSomething,
    doSomethingElse,
});