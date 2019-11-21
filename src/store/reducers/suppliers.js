import * as actionTypes from '../actions/actionsTypes';
import {updatedObject} from '../utility';


const initialState = {
    suppliers: null
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.SET_SUPPLIERS: return updatedObject(state, {suppliers: action.suppliers })
        default: return state
    }
}


export default reducer