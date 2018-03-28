import { combineReducers } from 'redux';
import { ADD_POSTS, 
         ADD_POST, 
         REMOVE_POST, 
         UPDATE_POST, 
         ADD_CATEGORIES, 
         ADD_COMMENTS,
         ADD_COMMENT,
         REMOVE_COMMENT,
         UPDATE_COMMENT } from '../actions/actions';

// Reducer for controlling the 'Posts Store'
function myPostStore (state = { posts:[] }, action) {

    var { post, posts } = action;
    var postsFromState = [];

    switch (action.type) {

        case ADD_POSTS:
            return {
                ...state,
                posts
            };
        
        case ADD_POST:
            postsFromState = state.posts;
            postsFromState.push(post);
            return {
                ...state,
                posts: postsFromState
            };

        case REMOVE_POST:
            postsFromState = state.posts.filter(currentPost => currentPost.id !== post.id);
            return {
                ...state,
                posts: postsFromState
            };
        
        case UPDATE_POST:
            postsFromState = state.posts.map(currentPost => {
                if (currentPost.id === post.id)
                    currentPost = post;
                return currentPost;
            })
            return {
                ...state,
                posts: postsFromState
            };
                
        default:
            return state;

    }

}

// Reducer for controlling the 'Comments Store'
function myCommentStore (state = {}, action) {

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
        let comments = state[postId] ? state[postId] : [];
        comments.push(comment);
        return { 
            ...state,
            [postId]: comments
        };
    }

    // Remove a comment
    if (action.type === REMOVE_COMMENT) {
        let comments = state[postId].filter(com => com.id !== comment.id);
        return { 
            ...state,
            [postId]: comments
        };
    }

    // Update a comment
    if (action.type === UPDATE_COMMENT) {
        let comments = state[comment.parentId].map(currentComment => {
            if (currentComment.id === comment.id)
                currentComment = comment;
            return currentComment;
        })   
        return { 
            ...state,
            [comment.parentId]: comments
        };
    }

    return state;

}

// Reducer for controlling the 'Category Store'
function myCategoryStore (state = { categories:[] }, action) {

    switch (action.type) {

        case ADD_CATEGORIES:
            const { categories } = action;
            return {
                ...state,
                categories
            }

        default:
            return state;

    }
}

export default combineReducers({
    myPostStore,
    myCommentStore,
    myCategoryStore,
});