import React, { Component } from 'react';
import * as api from '../utils/api';
import { Link, withRouter } from 'react-router-dom';
import SinglePostView from './SinglePostView';
import { connect } from 'react-redux';
import { updatePost, addCategories, addPosts, removePost } from '../actions/actions'

/* This component is the Default (List) View of the app. It receives posts and categories
/* into its props directly from the Redux Store. Then, stores the posts in its local state.

/* I decided to do it this way because I did not want to re-order posts inside the Redux Store
/* everytime user selects a different sort by option. So, we order them here in the local state
/* and display these. When user makes a change to a post (voteScore), we update the post in the
/* main Redux Store, not in the local state. This results in the props being sent to the
/* component by Redux Store once again. So using componentWillReceiveProps we take props, sort
/* them and store in the local state again.
/*
/* Basically local state is being used instead of a instance variable here. Could we do that?
/* Which one is a preferred way of doing this?
/*
/* Ozgun Ulusoy, March 2018
*/

class DefaultView extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        if (this.props.posts && this.props.posts.length > 0) {
            this.initialize(this.props.posts);
        }
    }

    componentWillReceiveProps(nextProps) {
        
        if (nextProps.posts && nextProps.posts.length > 0) {
            this.initialize(nextProps.posts);
        }
    }

    // 1. Find the Sort By select in dom read its default value
    // 2. Sort the posts based on this default value
    // 3. Store these sorted posts in the local state */
    initialize(posts) {
        let select = document.getElementById('sortSelect');
        if (select) {
            let selectedOption = select.options[select.selectedIndex].value;
            let sortedPosts = this.sortPosts(posts, selectedOption);
            this.setState({ posts: sortedPosts });
        }       
    }

    // Sort posts by timeStamp or voteScore
    sortPosts (posts, operation) {
        if (operation.toLowerCase() === 'timestamp') {
            return posts.sort((postA, postB) => postB.timestamp - postA.timestamp);
        } else if (operation.toLowerCase() === 'votescore') {
            return posts.sort((postA, postB) => postB.voteScore - postA.voteScore);
        }
    }

    // Handle sort change
    handleSortChange = (event) => {
        let operation = event.target.value;
        this.setState((prevState) => ({
            posts: this.sortPosts(prevState.posts, operation)
        }));
    }

    // Increase or decrease the voteScore for a post
    changeVote = (action, id) => {
        if (action === 'upVote' || action === 'downVote') {
            api.votePost(id, action).then(updatedPost => {
               this.props.updatePost(updatedPost);
            });
        }
    }

    // Delete post from the server
    deletePost = (postId) => {
        if (postId) {
            api.deletePost(postId).then(deletedPost => {
                this.props.removePost(deletedPost);
            });
        }
    }

    // Look at the category on the url and decide if this is a valid one or not
    show404() {
        if (this.props.dataReady === false)
            return false;
        let categoryFromParams = (this.props.params) ? this.props.params.category : '';
        if (categoryFromParams && this.props.categories) {
            if (this.props.categories.filter(ctg => ctg.name === categoryFromParams).length > 0)
                return false;
            else
                return true;            
        }         
    }

    // Read the desired category from the url params and filter (or not) posts based on that
    filterPosts() {
        let filteredPosts = this.state.posts;
        let categoryFromParams = (this.props.params) ? this.props.params.category : '';
        if (categoryFromParams) {
            filteredPosts = this.state.posts && this.state.posts.filter(post => post.category === categoryFromParams);
        }
        return filteredPosts;
    }
    
    render() {

        let filteredPosts = this.filterPosts();
        let categoryFromParams = (this.props.params) ? this.props.params.category : '';

        return (            
            <div>
                {this.show404() ? (
                    <div id='not-found'>Ooops! We could not find that page...</div>
                ):( this.props.dataReady && (
                    <div>
                        <div className='main-content'>
                        {(categoryFromParams) && (
                            <h2>Posts for Category: {categoryFromParams} </h2>
                        )}
                        {(!categoryFromParams) && (
                            <h2>All Posts</h2>
                        )}
                        <div>
                            <div className='float-left'>Sort by
                                <select className='select' defaultValue='timestamp' id='sortSelect' onChange={this.handleSortChange}>
                                    <option value='timestamp'>Time</option>
                                    <option value='voteScore'>Vote Score</option>
                                </select>
                            </div>
                            <div className='float-right'>
                                <Link to='/addEditPost'>Add New Post</Link>
                            </div>
                            <div className='clear-both'></div>
                        </div>
                        <ul>
                            {filteredPosts && filteredPosts.map(post => (
                                <li key={'postId-' + post.id}>                                
                                    <SinglePostView post={post} isSummary={true} changeVote={this.changeVote} deletePost={this.deletePost}/>
                                </li>
                            ))}
                        </ul>
                        </div>
                        <div className='sidebar-right'>
                            <h4>Categories</h4>
                            <ul>
                                <li><Link to={'/'}>Show All</Link></li>
                                {this.props.categories && this.props.categories.map(category => (
                                    <li key={category.name}>
                                        <Link to={`/${category.name}`}>{category.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    )
                )
            }
            </div>
        );   
    }
}

function mapStateToProps ({myPostStore, myCategoryStore}) {
    return { 
        posts: myPostStore.posts, 
        categories: myCategoryStore.categories,
        dataReady: myCategoryStore.categories == null ? false : true
    };
}

function mapDispatchToProps (dispatch) {
    return {
        updatePost: (data) => dispatch(updatePost(data)),
        addPosts: (data) => dispatch(addPosts(data)),
        addCategories: (data) => dispatch(addCategories(data)),
        removePost: (data) => dispatch(removePost(data))
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultView));