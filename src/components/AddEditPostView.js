import React, { Component } from 'react';
import * as api from '../utils/api';
import { addPost, updatePost } from '../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// We only store the current post in the local state of this component.
// All other categories and posts are accessed from Redux Store via props.
// When we create / update a post, we update server first, then update
// the post within the Redux Store.

class AddEditPostView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }
    }

    componentDidMount() {

        // Look at the url params, do we have a postId passed?
        let postId = (this.props.params) ? this.props.params.postId : null;

        // We are editing an existing post, find it in Redux Store, save it to local state
        if (postId) {
            var post = this.props.posts.find(post => post.id === postId);
            this.setState({
                post: post ? post : {}
            });
        
        // We are adding a new post, just set its default category
        } else {
            this.setState({
                post: { category: 'react' },
            });
        }

    }

    // Form is submitted, update the server, then update the Redux Store
    handleSubmit = (event) => {

        // Prevent default form submit event as it will force re-render
        event.preventDefault();

        // Update an existing post
        if (this.state.post.id) {
            api.updatePost(this.state.post.id, this.state.post).then(post => {
                this.props.updatePost(post);                    // Update post in the Redux store
                this.props.history.push(`/post/${post.id}`);    // Display the newly edited post
            })

        // Create a new post
        } else {
            api.addPost(this.state.post.id, this.state.post).then(post => {
                this.props.addPost(post);                       // Add the post to the Redux store
                this.props.history.push(`/post/${post.id}`);    // Display the newly created post
            })
        }

    }

    // Update local state on each keypress for input fields
    handleKeyPress = (event) => {
        const propertyName = event.target.name;
        const value = event.target.value ? event.target.value : '';
        this.setState((prevState) => ({
            post: {
                ...prevState.post,
                [propertyName]: value
            }
        }));
    }

    // Update local state when category is changed using dropdown
    handleCategoryChange = (event) => {
        const category = event.target.value;
        this.setState((prevStsate) => ({
           post: {
               ...prevStsate.post,
               category
           }
        }));
    }

    render() {
        
        const { post } = this.state;
        const { categories } = this.props;

        // If editing existing post, disable some fields
        const status = post.id ? 'disabled' : 'enabled';
        const statusAttribue = { [status] : status }

        return (
            <div>
                {
                    (post.id) ? (
                    <h2>Edit Post</h2> ) : (
                    <h2>Add New Post</h2> )
                }
                <div className='add-edit-post'>
                    <form onSubmit={this.handleSubmit}>
                        <label>Title: </label><input name='title' type='text' placeholder='Title' value={post.title ? post.title : ''} onChange={this.handleKeyPress} />
                        <div className='clear-both'></div>
                        <label>Body: </label><textarea name='body' rows='4' placeholder='Body' value={post.body ? post.body : ''} onChange={this.handleKeyPress} />
                        <div className='clear-both'></div>
                        <label>Author: </label>
                        <input name='author' type='text' placeholder='Author' value={post.author ? post.author : ''} onChange={this.handleKeyPress} {...statusAttribue} />
                        <div className='clear-both'></div>
                        <label>Category: </label>
                        <select id='categorySelect' defaultValue='react' {...statusAttribue} onChange={this.handleCategoryChange}>
                            {
                                categories.map(category => (
                                    <option key={category.name} value={category.name}>{category.name}</option>
                                ))
                            }
                        </select>
                        <div className='clear-both'></div>
                        <button>Submit</button>
                        <div className='clear-both'></div>
                    </form>
                </div>
            </div>
        )
    }

}

function mapStateToProps ({myPostStore, myCategoryStore}) {
    return {
        posts: myPostStore.posts,
        categories: myCategoryStore.categories
    };
}

function mapDispatchToProps (dispatch) {
    return {
        addPost: (data) => dispatch(addPost(data)),
        updatePost: (data) => dispatch(updatePost(data))
    };
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditPostView));