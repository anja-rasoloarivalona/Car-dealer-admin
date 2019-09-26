import * as actionTypes from './actionsTypes';


export const setRequestedProduct = data => {
    return {
        type: actionTypes.SET_REQUESTED_PRODUCT,
        product: data
    }
}


export const setRequestedProductId = data => {
    return {
        type: actionTypes.SET_REQUESTED_PRODUCT_ID,
        id: data
    }
}