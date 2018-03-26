import React, { Component } from 'react';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';

class CategoryView extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            posts: []
        }
    }

    // Fetch from API
    componentDidMount() {
        api.fetchCategories().then(categories => {
            this.setState({categories});
        }); 
        api.fetchPosts().then(posts => {
            this.setState({posts});
        });
    }

    // Handle sort change
    handleSortChange = (event) => {
        if (event.target.value === 'timeStamp') {
            this.setState((prevState) => ({
                posts: prevState.posts.sort((postA, postB) => postB.timestamp - postA.timestamp)
            }))
        } else {
            this.setState((prevState) => ({
                posts: prevState.posts.sort((postA, postB) => postB.voteScore - postA.voteScore)
            }))
        }
    }

    // Render
    render() {
        return ( 
            <div>
                <div className='main-content'>
                    <h4>Posts by Category: {this.props.category}</h4>
                    <div>
                        <div className='float-left'>Sort by
                            <select className='select' onChange={this.handleSortChange}>
                                <option value='timeStamp'>Time</option>
                                <option value='voteScore'>Vote Score</option>
                            </select>
                        </div>
                        <div className='float-right'>
                            <Link to=''>Add New Post</Link>
                        </div>
                        <div className='clear-both'></div>
                    </div>
                    <ul>
                        {this.state.posts.map(post => (
                            <li key={'postId-' + post.id}>
                                <div className='post-summary'>
                                    <div className='post-summary-title'>{post.title}</div>
                                    <div className='post-summary-info'>
                                        <p><strong><span className='dark-red'>Category: </span></strong>{post.category}</p>
                                        <p><strong><span className='dark-red'>Time: </span></strong>{post.timestamp}</p>
                                        <p><strong className='dark-red'>Vote Score: </strong>{post.voteScore}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='sidebar-right'>
                    <h4>Categories</h4>
                    <ul>
                        {this.state.categories.map(category => (
                            <li key={category.name}>
                                <div>{category.name}</div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        );
    }

}

export default CategoryView;