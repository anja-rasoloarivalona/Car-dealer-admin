import * as actionTypes from './actionsTypes'

export const setLang = lang => {
    return {
        type: actionTypes.SET_LANG,
        lang: lang
    }
}

export const setCurrency = currency => {
    return {
        type: actionTypes.SET_CURRENCY,
        currency
    }
}