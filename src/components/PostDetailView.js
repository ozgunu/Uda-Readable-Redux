import React, { Component } from 'react';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import SingleCommentView from './SingleCommentView';
import SinglePostView from './SinglePostView';
import AddEditCommentView from './AddEditCommentView';

class PostDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {},
            comments: []
        }
    }

    componentDidMount() {
        let postId = (this.props.params) ? this.props.params.postId : '';
        if (postId) {
            api.fetchPost(postId).then(fetchedPost => {

                // If post has comments, fetch them as well
                if (fetchedPost.commentCount && fetchedPost.commentCount > 0) {
                    api.fetchPostComments(postId).then(fetchedComments => {
                        this.setState( {post: fetchedPost, comments: fetchedComments} );
                    })

                // Post has no comments
                } else {
                    this.setState( {post: fetchedPost} );
                }       

            });
        }
    }

    // Delete post
    deletePost = (event) => {
        event.preventDefault();
        if (this.state.post.id) {
            api.deletePost(this.state.post.id).then(post => {
                this.props.history.push('/');
            });
        }
    }

    // Show or hide comment input box
    toggleCommentInput = () => {
        if (document.getElementById('add-comment-box').style.display === 'none') {
            document.getElementById('add-comment-box').style.display = 'block';
        } else {
            document.getElementById('add-comment-box').style.display = 'none';
        }
    }

    // Submit a comment
    addComment = (comment) => {
        api.addComment(comment).then(newComment => {
            this.toggleCommentInput();
            this.setState(prevState => {
                let comments = prevState.comments.slice();
                comments.push(newComment);
                return {
                    comments: comments,
                    post: {
                        ...prevState.post,
                        commentCount: prevState.post.commentCount + 1
                    }
                }
            });
        });
    }

    // Delete a comment
    deleteComment = (commentId) => {
        api.deleteComment(commentId).then(deletedComment => {
            this.setState(prevState => ({
                comments: prevState.comments.filter(comment => comment.id !== commentId)
            }))
        })
    }

    // Increase or decrease the voteScore for the post
    changeVote = (action, id) => {
        if (action === 'upVote' || action === 'downVote') {
            api.votePost(id, action).then(post => {                
                this.setState({post});
            });
        }
    }

    render() {

        const { post, comments } = this.state;
               
        return (
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
        )

    }



}

export default PostDetailView;