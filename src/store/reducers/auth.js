import * as actionTypes from '../actions/actionsTypes';
import { updatedObject} from '../utility';


const initialState = {
    auth: false,
    token: null,
    adminId: null,
    adminName: null
}


const loginSucced = (state, action) => {
    return updatedObject( state, {
        auth: true,
        token: action.token,
        adminId: action.adminId,
        adminName: action.adminName
    })
}

const setLoginStateToTrue = (state, action) => {
    return updatedObject(state, {
        auth: action.isAuth,
        token: action.token,
        adminId: action.adminId,
        adminName: action.adminName
    })
}

const setLoginStateToFalse = state => {
    return updatedObject(state, {
        auth: false,
        token: null,
        adminId:  null,
        adminName: null
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.LOGIN_SUCCEDED: return loginSucced(state, action);
        case actionTypes.LOGIN_FAILED: return state;
        case actionTypes.SET_LOGIN_STATE_TO_TRUE: return setLoginStateToTrue(state, action);
        case actionTypes.SET_LOGIN_STATE_TO_FALSE: return setLoginStateToFalse(state);

        default: return state
    }
}

export default reducer