import * as actionsTypes from '../actions/actionsTypes';
import {updatedObject} from '../utility'


const initialState = {
    currentPage: 1,
    itemsPerPage: 6
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionsTypes.SET_CURRENT_PAGE : return updatedObject(state, {currentPage: action.currentPage});
        default: return state
    }
}

export default reducer;