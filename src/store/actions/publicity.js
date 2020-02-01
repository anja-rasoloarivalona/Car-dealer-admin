import * as actionTypes from './actionsTypes';


export const setPublicityData = data => {
    return {
        type: actionTypes.SET_PUBLICITY_DATA,
        pubProducts: data.pubProducts,
        homePageProducts: data.homePageProducts
    }
}

export const setPublicityEditingMode = data => {
    return {
        type: actionTypes.SET_PUBLICITY_EDITING_MODE,
        editingMode: data
    }
}

export const setPublicitySelectedPubProducts = data => {
    return {
        type: actionTypes.SET_PUBLICITY_SELECTED_PUB_PRODUCTS,
        data: data
    }
}

export const setPublicitySelectedHomePageProducts= data => {
    return {
        type: actionTypes.SET_PUBLICITY_SELECTED_HOMEPAGE_PRODUCTS,
        data: data
    }
}

export const cancelPublicityEditingMode = section => {
    return {
        type: actionTypes.CANCEL_PUBLICITY_EDITING_MODE,
        section: section
    }
}

export const deletePublicitySelectedPubProducts = data => {
    return {
        type: actionTypes.DELETE_PUBLICITY_SELECTED_PUB_PRODUCTS,
        data: data
    }
}

export const deletePublicitySelectedHomePageProducts = data => {
    return {
        type: actionTypes.DELETE_PUBLICITY_SELECTED_HOMEPAGE_PRODUCTS,
        data: data
    }
}

export const togglePublicitySelector = section => {
    return {
        type: actionTypes.TOGGLE_PUBLICITY_SELECTOR,
        section: section
    }
}

export const setPublicitySelectorSelectedProducts = data => {
    return {
        type: actionTypes.SET_PUBLICITY_SELECTOR_SELECTED_PRODUCTS,
        productsIds: data.productsIds,
        productsDetails: data.productsDetails
    }
}

export const addPublicityPubProducts = data => {
    return {
        type: actionTypes.ADD_PUBLICITY_PUB_PRODUCTS,
        data: data
    }
}

export const addPublicityHomePageProducts = data => {
    return {
        type: actionTypes.ADD__PUBLICITY__HOMEPAGE__PRODUCTS,
        data: data
    }
}