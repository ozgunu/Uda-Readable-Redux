import { ADD_CATEGORIES } from '../actions/types';

// Reducer for controlling the 'Category Store'
export function myCategoryStore (state = { categories: null }, action) {
    
    switch (action.type) {

        case ADD_CATEGORIES:
            const { categories } = action;
            return {
                ...state,
                categories
            }

        default:
            return state;

    }
    
}