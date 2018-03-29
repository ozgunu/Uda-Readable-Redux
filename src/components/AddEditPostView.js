import React, { Component } from 'react';
import * as api from '../utils/api';
import { addPost, updatePost } from '../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/* Redux Store passes the Post object (when editing a post), and
/* categories array (always) into this component's props.
/*
/* We only store the current post in the local state of this component.
/* So we can update instantly it when user types in the input fields.
/* When user creates / updates a post, we update the server first, then
/* the post within the Redux Store.
/*
/* Ozgun Ulusoy, March 2018
*/

class AddEditPostView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }
    }

    componentDidMount() {
       this.initialize(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
    }
    
    initialize(props) {

        // We are editing an existing post
        if (props.post) {
            this.setState({
                post: props.post
            });
        
        // We are adding a new post, just set its default category
        } else {
            this.setState({
                post: { category: (props.categories && props.categories[0]) ? props.categories[0].name : 'Undefined Category' },
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
                this.props.updatePost(post);                                // Update post in the Redux store
                this.props.history.push(`/${post.category}/${post.id}`);    // Display the newly edited post
            })

        // Create a new post
        } else {
            api.addPost(this.state.post.id, this.state.post).then(post => {
                this.props.addPost(post);                                   // Add the post to the Redux store
                this.props.history.push(`/${post.category}/${post.id}`);    // Display the newly created post
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
                        <select id='categorySelect' defaultValue='react' value={post.category} {...statusAttribue} onChange={this.handleCategoryChange}>
                            {
                                categories && categories.map(category => (
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

function mapStateToProps ({myPostStore, myCategoryStore}, selfProps) {

    // Read the postId from component's self props
    const postId = selfProps.params.postId ? selfProps.params.postId : null;
    
    if (postId) {
        let post = myPostStore.posts && myPostStore.posts.find(post => post.id === postId);
        return {
            post,
            categories: myCategoryStore.categories
        };

    } else  {  
        return {
            categories: myCategoryStore.categories
        };
    }

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