import React, { Component } from 'react';
import * as api from '../utils/api';
import { Link, withRouter } from 'react-router-dom';
import SingleCommentView from './SingleCommentView';
import SinglePostView from './SinglePostView';
import AddEditCommentView from './AddEditCommentView';
import { updatePost, removePost, addComments, addComment, removeComment } from '../actions/actions';
import { connect } from 'react-redux';

/* This component does not have its own state. It receives the necessary Post and Comments object in its props
/* directly from the Redux Store. For comments, here is what we do:

/* On initial app load, we don't fetch all comments for all posts (not feasible). Instead, when we need to 
/* show a post's comments, we check our Redux Store. If we find comments for this postId, then we pass these
/* directly to this component (mapStateToProps). If we don't find comments however, this component will make
/* the API call, fetch comments from server and update the Redux Store. Which then will cause a re-render and
/* this second time our component will receive these comments in its props because they now exist in the Redux Store. */

class PostDetailView extends Component {
        
    componentDidMount() {
        this.initialize(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
    }
    
    // 1. Check if Redux Store has the comments for this post
    // 2. If needed fetch post's comments from the server and store in Redux Store
    initialize(props) {
        if (props.post && props.post.commentCount && props.post.commentCount > 0) {
            if (props.fetchComments && props.fetchComments === true) {
                api.fetchPostComments(props.post.id).then(fetchedComments => {
                    props.addComments(props.post.id, fetchedComments);
                });
            }
        }
    }

    // Delete post from the server
    deletePost = (event) => {
        event.preventDefault();
        if (this.props.post.id) {
            api.deletePost(this.props.post.id).then(deletedPost => {
                this.props.removePost(deletedPost); // Remove post from Redux Store
                this.props.history.push('/');       // Go to the main page (default view)
            });
        }
    }

    // Show or hide comment input box
    // What would be the REACT way of doing this?
    toggleCommentInput = () => {
        if (document.getElementById('add-comment-box').style.display === 'none') {
            document.getElementById('add-comment-box').style.display = 'block';
        } else {
            document.getElementById('add-comment-box').style.display = 'none';
        }
    };

    // Submit a comment
    addComment = (comment) => {
        api.addComment(comment).then(newComment => {
            this.toggleCommentInput();                  // Hide comment input box
            let post = this.props.post;                 // Get post
            this.props.addComment(post.id, newComment); // Add comment to Redux Store
            this.props.updatePost(post.commentCount++); // Update post in Redux Store
        });
    };

    // Delete a comment
    deleteComment = (commentId) => {
        api.deleteComment(commentId).then(deletedComment => {
            let post = this.props.post;                          // Get post
            this.props.removeComment(post.id, deletedComment);   // Remove comment from Redux Store
            this.props.updatePost(post.commentCount--);          // Update post in Redux Store
        });
    };

    // Increase or decrease the voteScore for the post
    changeVote = (action, id) => {
        if (action === 'upVote' || action === 'downVote') {
            api.votePost(id, action).then(updatedPost => {  // Update post in the server
                this.props.updatePost(updatedPost);         // Update post in Redux Store
            });
        }
    };

    render() {

        let post = this.props.post;
        let comments = this.props.comments ? this.props.comments : [];
              
        return (
            <div>
                {(post) && (
                    <div className='main-content'>
                        <h2>Post Details</h2>
                        <div>                    
                            <div className='float-left'>                        
                                <Link to='/'>Main Page</Link>
                            </div>
                            <div className='float-right'>
                                <Link to='/addEditPost' style={{marginLeft: '10px'}}>Add New Post</Link>
                                <a onClick={this.deletePost} style={{marginLeft: '10px'}}>Delete Post</a>
                                <Link to={`/addEditPost/${post.id}`} style={{marginLeft: '10px'}}>Edit Post</Link>
                                <a onClick={this.toggleCommentInput} style={{marginLeft: '10px'}}>Add Comment</a>
                            </div>
                            <div className='clear-both'></div>
                        </div>
                        <div className='clear-both'></div>
                        <SinglePostView post={post} isSummary={false} changeVote={this.changeVote}/>

                        <div id='add-comment-box' style={{display:'none'}}>
                            <AddEditCommentView parentId={post.id} submitComment={this.addComment}/>
                            <div className='clear-both'></div>
                        </div>

                        <ul>
                            {comments.map(comment => (
                                <li key={'commentId-' + comment.id}>
                                    <SingleCommentView comment={comment} deleteComment={this.deleteComment}/>
                                </li>
                            ))}
                        </ul>                    
                    </div>
                )}
            </div>
        )
    }
}

// This component will have the post and the comments of that post
// passed to its props by Redux. But we need to do some calculations firts.
function mapStateToProps ({myPostStore, myCommentStore}, selfProps) {
    
    // Read the postId from component's self props (this comes from url params)
    const postId = selfProps.params.postId ? selfProps.params.postId : null;

    // Find the post in Redux Store using its ID
    let post = myPostStore.posts.find(post => post.id === postId);
    
    // If we find comments for this postId in Redux Store, send them in props
    if (myCommentStore[postId]) {
        return {
            post,
            fetchComments: false,
            comments: myCommentStore[postId]
        };

    // If not, send fetchComments as true, which will result in an 
    // api call to fetch post's comments and store in Redux Store
    } else {
        return {
            post,
            fetchComments: true
        };
    }

}

function mapDispatchToProps (dispatch) {
    return {
        updatePost: (data) => dispatch(updatePost(data)),
        removePost: (data) => dispatch(removePost(data)),
        addComments: (postId, comments) => dispatch(addComments(postId, comments)),
        addComment: (postId, comment) => dispatch(addComment(postId, comment)),
        removeComment: (postId, comment) => dispatch(removeComment(postId, comment))
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(PostDetailView));

//export default PostDetailView;