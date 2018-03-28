import React, { Component } from 'react';
import * as api from '../utils/api';
import DefaultView from './DefaultView';
import PostDetailView from './PostDetailView';
import AddEditPostView from './AddEditPostView';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addPost, addPosts, removePost, updatePost, addCategories } from '../actions/actions';

class App extends Component {

  // Fetch data from server
  componentDidMount() {

    api.fetchCategories().then(categories => {
        this.props.addCategories(categories);
    });

    api.fetchPosts().then(posts => {
        this.props.addPosts(posts);
    });

  }

  render() {
    return (
      <div>

          { /* Default View */ }
          <Route exact path="/" render={({history}) => (
            <DefaultView history={history} />
          )}/>
      
          { /* Category View */ }
          <Route path="/category/:category" render={({history, match}) => (
            <DefaultView history={history} params={match.params}/>
          )}/>

          { /* Post Detail View */ }
          <Route path="/post/:postId" render={({history, match}) => (
            <PostDetailView history={history} params={match.params}/>
          )}/>

          { /* Post Add */ }
          <Route exact path="/addEditPost" render={({history, match}) => (
            <AddEditPostView history={history} params={match.params} />
          )}/>

          { /* Post Edit */ }
          <Route path="/addEditPost/:postId" render={({history, match}) => (
            <AddEditPostView history={history} params={match.params}/>
          )}/>
          
      </div>
    );
  }
}

function mapStateToProps ({ posts, categories }) {
  return { posts, categories };
}

function mapDispatchToProps (dispatch) {
  return {
    addPosts: (data) => dispatch(addPosts(data)),
    addPost: (data) => dispatch(addPost(data)),
    removePost: (data) => dispatch(removePost(data)),
    updatePost: (data) => dispatch(updatePost(data)),
    addCategories: (data) => dispatch(addCategories(data))
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
