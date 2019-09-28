import * as actionTypes from '../actions/actionsTypes';
import {updatedObject } from '../utility';


const initialState = {
    showFullNavbar: true,
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.TOGGLE_SHOW_FULL_NAVBAR : return updatedObject(state, {showFullNavbar: !state.showFullNavbar} );
        default: return state
    }
}

export default reducer;