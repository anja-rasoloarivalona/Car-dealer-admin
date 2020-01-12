import * as actionTypes from '../actions/actionsTypes';
import { updatedObject } from '../utility';


const initialState = {
    errors: null
}

const reducer = (state = initialState, action) => {
    switch (action.type){

        case actionTypes.SET_ERROR: return updatedObject(state, {errors: action.data})
        default: return state
    }
}

export default reducer