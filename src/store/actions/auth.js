import * as actionTypes from './actionsTypes';



export const loginSucceeded = data => {
    return {
        type: actionTypes.LOGIN_SUCCEDED,
        token: data.token,
        adminId: data.adminId,
        adminName: data.adminName

    }
}

export const loginFailed = () => {
    return {
        type: actionTypes.LOGIN_FAILED
    }
}

export const setLoginStateToTrue = (isAuth, token, adminId, adminName) => {
    return {
        type: actionTypes.SET_LOGIN_STATE_TO_TRUE,
        isAuth: isAuth,
        token: token,
        adminId: adminId,
        adminName: adminName
    }
}

export const setLoginStateToFalse = () => {
    return {
        type: actionTypes.SET_LOGIN_STATE_TO_FALSE
    }
}