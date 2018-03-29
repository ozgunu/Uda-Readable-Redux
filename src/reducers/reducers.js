import { combineReducers } from 'redux';
import { myPostStore } from './postsReducer';
import { myCommentStore } from './commentsReducer';
import { myCategoryStore } from './categoriesReducer';

export default combineReducers({
    myPostStore,
    myCommentStore,
    myCategoryStore,
});