const api = 'http://localhost:3001';

const headers = {
  'Authorization': 'whatever-you-want',
  'Content-Type' : 'application/json'
}

// Fetch categories
export const fetchCategories = () =>
  fetch(`${api}/categories`, { method: 'GET', headers })
    .then(res => res.json())
    .then(data => data.categories);
         
// Fetch posts
export const fetchPosts = () =>
  fetch(`${api}/posts`, { method: 'GET', headers })
    .then(res => res.json());

// Fetch post by id
export const fetchPost = (postId) =>
  fetch(`${api}/posts/${postId}`, { method: 'GET', headers })
    .then(res => res.json());

// Add a new post
export const addPost = (postId, post) => {
  // This should be made in the server, not here !!!!
  let randomId = Math.random().toString(36).substring(7);
  let body = JSON.stringify({ 
    'title': post.title, 
    'body': post.body, 
    'author': post.author, 
    'category': post.category, 
    'timestamp' : Date.now(), 
    'id': randomId });
  return fetch(`${api}/posts`, { body, method: 'POST', headers }
  ).then(res => res.json());
}

// Update an existing post
export const updatePost = (postId, post) => {
  let body = JSON.stringify({ 'title': post.title, 'body': post.body });
  return fetch(`${api}/posts/${postId}`, { body, method: 'PUT', headers }
  ).then(res => res.json());
}

// Delete a post
export const deletePost = (postId) => {
  return fetch(`${api}/posts/${postId}`, { method: 'DELETE', headers }
  ).then(res => res.json());
}

// Vote for a comment
export const votePost = (postId, action) => {
  let body = JSON.stringify({ 'option': action });
  return fetch(`${api}/posts/${postId}`, { body, method: 'POST', headers })
    .then(res => res.json());
}

// Fetch comments for a post
export const fetchPostComments = (postId) =>
fetch(`${api}/posts/${postId}/comments`, { method: 'GET', headers })
  .then(res => res.json());

// Vote for a comment
export const voteComment = (commentId, action) => {
  let body = JSON.stringify({ 'option': action });
  return fetch(`${api}/comments/${commentId}`, { body, method: 'POST', headers })
    .then(res => res.json());
}

// Add a new comment
export const addComment = (comment) => {
  // This should be made in the server, not here !!!!
  let randomId = Math.random().toString(36).substring(7);
  let body = JSON.stringify({
    'body': comment.body,
    'author': comment.author,
    'parentId': comment.parentId,
    'timestamp' : Date.now(),
    'id': randomId });
  return fetch(`${api}/comments`, { body, method: 'POST', headers })
    .then(res => res.json());
}

// Update an existing comment
export const updateComment = (comment) => {
  let body = JSON.stringify({ 'body': comment.body });
  return fetch(`${api}/comments/${comment.id}`, { body, method: 'PUT', headers })
    .then(res => res.json());
}

// Delete a comment
export const deleteComment = (commentId) => {
  return fetch(`${api}/comments/${commentId}`, { method: 'DELETE', headers }
  ).then(res => res.json());
}