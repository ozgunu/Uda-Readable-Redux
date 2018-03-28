
import React, { Component } from 'react';

/* This component maintains its own state for managint its input fields.
/* It receives a comment object in its props, passed to it by its parent component.
/* Stores this in the local state, populates input fields from this if necessary etc.

/* When a comment is submitted by the submit button, the function passed by the parent
/* component is called, and the local state is passed to that function (as a comment object).
/* Depending on which parent created this component, this function either creates a new
/* comment or edits the existing one in the server. 
/*
/* Ozgun Ulusoy, March 2018
*/

class AddEditCommentView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            body: '',
            author: '',
            parentId: '',
            id: '',
            isEditing: false
        };
    }

    componentDidMount() {
        this.initialize(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
    }
    
    initialize(props) {

        // We will be adding a new comment
        if (props.parentId) {
            this.setState({parentId: props.parentId});
                    
        // We will be editing a comment
        } else if (props.comment) {
            const { comment } = props;
            this.setState({
                body: comment.body ? comment.body : '',
                author: comment.author ? comment.author : '',
                parentId: comment.parentId ? comment.parentId : '',
                id: comment.id ? comment.id : '',
                isEditing: true
            });
        }

    }
    
    handleKeyPress = (event) => {
        let property = event.target.name;
        let value = event.target.value;
        this.setState({[property]: value});
    }

    submitComment = (event) => {
        event.preventDefault();
        if (this.props.submitComment) {
            this.props.submitComment(this.state);
            this.setState({
                author: '',
                body: ''
            })
        }
    }

    render() {

        // If editing existing post, disable some fields
        const status = this.state.isEditing ? 'disabled' : 'enabled';
        const statusAttribue = { [status] : status }

        return (
            <div className='add-edit-comment'>
                <form onSubmit={this.submitComment}>
                    <input name='author' type='text' placeholder='Author' value={this.state.author ? this.state.author : ''} onChange={this.handleKeyPress} {...statusAttribue}/>
                    <input name='body' type='text' placeholder='Comment' value={this.state.body ? this.state.body : ''} onChange={this.handleKeyPress} />
                    <div className='clear-both'></div>
                    <button>Submit</button>
                    <div className='clear-both'></div>
                </form>
            </div>
        )
    }

}

export default AddEditCommentView;