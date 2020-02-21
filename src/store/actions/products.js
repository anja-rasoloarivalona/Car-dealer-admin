import * as actionTypes from './actionsTypes';


export const initAppData = data => {
    return  {
        type: actionTypes.INIT_APP_DATA,
        data: data
    }
}
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


export const addTotalProducts = () => {
    return {
        type: actionTypes.ADD_TOTAL_PRODUCTS
    }
}

export const setInventoryCurrentPage = page => {
    return {
        type: actionTypes.SET_INVENTORY_CURRENT_PAGE,
        page: page
    }
}