import React, { Component } from 'react';
import * as api from '../utils/api';
import { withRouter } from 'react-router-dom';
import AddEditCommentView from './AddEditCommentView';
import { updateComment } from '../actions/actions';
import { connect } from 'react-redux';

/*  This component does not maintain its own state. It receives the
/*  comment object in its props from the previous component - the conventional
/*  way, and uses that to populate the comment.
/*
/*  When an update has been made by user to the comment, this component
/*  updates the comment in the server first, and then updates the comment
/*  in the Redux Store. */

class SingleCommentView extends Component {

    // Increase or decrease the voteScore for the comment
    changeVote = (action, id) => {
        if (action === 'upVote' || action === 'downVote') {
            api.voteComment(id, action).then(updatedComment => {
                this.props.updateComment(updatedComment);
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
            this.props.updateComment(updatedComment);
        })
    }

    render() {

        // Get the comment from the state
        const { comment } = this.props;

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

function mapDispatchToProps(dispatch) {
    return {
        updateComment: (comment) => dispatch(updateComment(comment))
    };
}

export default withRouter(connect(
    null,
    mapDispatchToProps
)(SingleCommentView));

//export default SingleCommentView;