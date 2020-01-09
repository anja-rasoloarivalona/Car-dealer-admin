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

export const toggleEditingMode = () => {
    return {
        type: actionTypes.TOGGLE_EDITING_MODE
    }
}

export const setProducts = data => {
    return {
        type: actionTypes.SET_PRODUCTS,
        products: data
    }
}

export const setBrandsAndModels = data => {
    return {
        type: actionTypes.SET_BRANDS_AND_MODELS,
        brandsAndModels: data
    }
}

export const setTotalProducts = data => {
    return {
        type: actionTypes.SET_TOTAL_PRODUCTS,
        totalProducts: data
    }
}

export const addTotalProducts = () => {
    return {
        type: actionTypes.ADD_TOTAL_PRODUCTS
    }
}