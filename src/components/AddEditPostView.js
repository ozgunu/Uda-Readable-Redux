import React, { Component } from 'react';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import serializeForm from 'form-serialize'; 

class AddEditPostView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {},
            categories: []
        }
    }

    componentDidMount() {
        let postId = (this.props.params) ? this.props.params.postId : null;
        if (postId) {
            // We are editing an existing post, fetch it, then fetch categories
            api.fetchPost(postId).then(fetchedPost => {
                api.fetchCategories().then(categories => {
                    this.setState({post: fetchedPost, categories});
                });
            });
        } else {
            // We are adding a new post, just fetch categories
            api.fetchCategories().then(categories => {
                this.setState({ 
                    categories,
                    post: { category: 'react' },
                });
            });
        }
    }

    handleSubmit = (event) => {
        // Prevent default form submit event which will force re-render
        event.preventDefault();

        // Update an existing post
        if (this.state.post.id) {
            api.updatePost(this.state.post.id, this.state.post).then(post => {
                this.props.history.push(`/post/${post.id}`);
            })

        // Create a new post
        } else {
            api.addPost(this.state.post.id, this.state.post).then(post => {
                this.props.history.push(`/post/${post.id}`);
            })
        }
    }

    handleKeyPress = (event) => {
        const propertyName = event.target.name;
        const value = event.target.value ? event.target.value : '';
        this.setState((prevState) => ({
            ...prevState,
            post: {
                ...prevState.post,
                [propertyName]: value
            }
        }));
    }

    handleCategoryChange = (event) => {
        const category = event.target.value;
        this.setState((prevStsate) => ({
           ...prevStsate,
           post: {
               ...prevStsate.post,
               category
           }
        }));
    }

    render() {
        
        const { post, categories } = this.state;

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

export default AddEditPostView;