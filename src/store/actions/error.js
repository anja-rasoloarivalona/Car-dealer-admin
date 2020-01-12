import * as actionTypes from './actionsTypes'


export const setError = data => {
    return {
        type: actionTypes.SET_ERROR,
        data: data
    }
}
