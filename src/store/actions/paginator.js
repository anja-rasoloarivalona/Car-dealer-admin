import * as actionTypes from '../actions/actionsTypes';


export const setCurrentPage = data => {
    return {
        type: actionTypes.SET_CURRENT_PAGE,
        currentPage: data
    }
}
