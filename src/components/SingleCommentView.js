import React, { Component } from 'react';
import * as api from '../utils/api';
import AddEditCommentView from './AddEditCommentView';
import { updateComment } from '../utils/api';

class SingleCommentView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment : {}
        }
    }

    componentDidMount() {
        this.setState({comment: this.props.comment});
    }

    // Increase or decrease the voteScore for the comment
    changeVote = (action, id) => {
        if (action === 'upVote' || action === 'downVote') {
            api.voteComment(id, action).then(comment => {
                this.setState({comment});
            });
        }
    }

    // Show or hide comment input box
    toggleCommentInput = (commentId) => {
        let commentBox = document.getElementById(`edit-comment-box-${commentId}`);
        if (commentBox.style.display === 'none') {
            commentBox.style.display = 'block';
        } else {
            commentBox.style.display = 'none';
        }
    }

    editComment = (comment) => {
        api.updateComment(comment).then(updatedComment => {
            this.toggleCommentInput(comment.id);
            this.setState({comment: updatedComment});
        })
    }

    render() {

        // Get the comment from the state
        const { comment } = this.state;

        return (
            <div>
                <div className='float-right'>
                    <div className='post-comment-vote' onClick={() => this.changeVote('upVote', comment.id)}><span className='green'>+</span></div>
                    <div className='post-comment-vote' onClick={() => this.changeVote('downVote', comment.id)}><span className='dark-red'>-</span></div>
                </div>
                <div className='post-comment'>
                    <div className='comment-info-bar'>
                        <div><span className='dark-red-strong'>Author: </span>{comment.author}</div>
                        <div><span className='dark-red-strong'>Date: </span>{(new Date(comment.timestamp)).toLocaleString()}</div>
                        <div><span className='dark-red-strong'>Vote Score: </span>{comment.voteScore}</div>
                    </div>
                    <div className='clear-both'></div>
                    <div className='comment-body'>{comment.body}</div>
                    <div className='comment-footer'>                        
                        <div><a onClick={() => this.toggleCommentInput(comment.id)}>Edit</a></div>
                        <div><a onClick={() => this.props.deleteComment(comment.id)}>Delete</a></div>
                    </div>
                </div>
                <div className='clear-both'></div>
                <div id={`edit-comment-box-${comment.id}`} style={{display:'none'}}>
                    <AddEditCommentView comment={comment} submitComment={this.editComment}/>
                    <div className='clear-both'></div>
                </div>
            </div>
        )
    }

}

export default SingleCommentView;