import React from 'react';
import { Link } from 'react-router-dom';

const SinglePostView = (props) => {

    const { post, isSummary, changeVote } = props;
    const dateTime = (new Date(post.timestamp)).toLocaleString();

    return (
        <div>
            <div className='post-summary'>                
                <div className='float-right'><a onClick={() => {changeVote ? changeVote('downVote', post.id) : {}}}>Vote Down</a></div>
                <div className='float-right' style={{'marginRight': '10px'}}><a onClick={() => {changeVote ? changeVote('upVote', post.id) : {}}}>Vote Up</a></div>
                {
                    (isSummary) ? ( 
                        <Link to={`/post/${post.id}`}><div className='post-title'>{post.title}</div></Link> ):(
                        <div className='post-title'>{post.title}</div>
                    )
                }
                <div className='post-info-bar'>
                    <div><span className='dark-red-strong'>Author: </span>{post.author}</div>
                    <div><span className='dark-red-strong'>Comments: </span>{post.commentCount}</div>
                    <div><span className='dark-red-strong'>Category: </span>{post.category}</div>
                </div>
                <div className='post-info-bar'>
                    <div><span className='dark-red-strong'>Date: </span>{dateTime}</div>
                    <div><span className='dark-red-strong'>Vote Score: </span>{post.voteScore}</div>
                </div>
                {(!isSummary) && (
                    <div className='post-body'>{post.body}</div>
                )}
            </div>
        </div>
    );
}

export default SinglePostView;
