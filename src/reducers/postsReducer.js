import { ADD_POSTS, ADD_POST, REMOVE_POST, UPDATE_POST } from '../actions/types';

// Reducer for controlling the 'Posts Store'
export function myPostStore (state = { posts: null }, action) {
    
    var { post, posts } = action;
    var postsFromState = [];

    switch (action.type) {

        case ADD_POSTS:
            return {
                ...state,
                posts
            };
        
        case ADD_POST:
            postsFromState = state.posts.slice(0);
            postsFromState.push(post);
            return {
                ...state,
                posts: postsFromState
            };

        case REMOVE_POST:
            postsFromState = state.posts.slice(0);
            postsFromState = state.posts.filter(currentPost => currentPost.id !== post.id);
            return {
                ...state,
                posts: postsFromState
            };
        
        case UPDATE_POST:
            postsFromState = state.posts.slice(0);
            postsFromState = postsFromState.map(currentPost => {
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