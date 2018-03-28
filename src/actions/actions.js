export const ADD_POSTS = 'ADD_POSTS';
export const ADD_POST = 'ADD_POST';
export const REMOVE_POST = 'REMOVE_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const ADD_CATEGORIES = 'ADD_CATEGORIES';
export const ADD_COMMENTS = 'ADD_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';

export function addPost(post) {
    return {
      type: ADD_POST,
      post
    };
}

// Add all fetched posts at once to the store
export function addPosts(posts) {
    return {
        type: ADD_POSTS,
        posts
    };
}

// Remove a single post from the store
export function removePost(post) {
    return {
        type: REMOVE_POST,
        post
    };
}

// Update a single post in the store
export function updatePost(post) {
    return {
        type: UPDATE_POST,
        post
    }
}

// Add categories all together to the store
export function addCategories(categories) {
    return {
        type: ADD_CATEGORIES,
        categories
    }
}

// Add all comments for a post in the store
export function addComments(postId, comments) {
    return {
        type: ADD_COMMENTS,
        postId,
        comments
    }
}

// Add a comment for a post in the store
export function addComment(postId, comment) {
  return {
      type: ADD_COMMENT,
      postId,
      comment
  }
}

// Remove a comment from a post in the store
export function removeComment(postId, comment) {
  return {
      type: REMOVE_COMMENT,
      postId,
      comment
  }
}

// Update a comment of a post in the store
export function updateComment(comment) {
  return {
      type: UPDATE_COMMENT,
      comment
  }
}