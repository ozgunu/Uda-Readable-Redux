import { ADD_COMMENTS, ADD_COMMENT, REMOVE_COMMENT, UPDATE_COMMENT } from '../actions/types';

// Reducer for controlling the 'Comments Store'
export function myCommentStore (state = {}, action) {
    
    const { comments, comment, postId} = action;

    // Add all comments
    if (action.type === ADD_COMMENTS) {
        return { 
            ...state,
            [postId]: comments
        };
    }

    // Add single comment
    if (action.type === ADD_COMMENT) {
        // Used slice here to duplicate the array !!!
        let stateComments = state[postId] ? state[postId].slice(0) : [];
        stateComments.push(comment);
        return { 
            ...state,
            [postId]: stateComments
        };
    }

    // Remove a comment
    if (action.type === REMOVE_COMMENT) {
        let stateComments = state[postId] ? state[postId].slice(0) : [];
        stateComments = stateComments.filter(com => com.id !== comment.id);
        return { 
            ...state,
            [postId]: stateComments
        };
    }

    // Update a comment
    if (action.type === UPDATE_COMMENT) {
        let stateComments = state[comment.parentId] ? state[comment.parentId].slice(0) : []
        stateComments = stateComments.map(currentComment => {
            if (currentComment.id === comment.id)
                currentComment = comment;
            return currentComment;
        })   
        return { 
            ...state,
            [comment.parentId]: stateComments
        };
    }

    return state;

}