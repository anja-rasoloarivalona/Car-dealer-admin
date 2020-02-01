import * as actionTypes from '../actions/actionsTypes';
import {updatedObject } from '../utility';


const initialState = {
    INIT_pubProducts: null,
    INIT_homePageProducts: null,

    currentPubProducts: null,
    currentHomePageProducts: null,

    selectedPubProducts: [],
    selectedHomePageProducts: [],

    newPubProducts: [],
    newHomePageProducts: [],

    showSelector: false,
    selectorTitle: null,
    editingMode: [],

    selectorSelectedProductsIds: [],
    selectorSelectedProductsDetails: []
}


const setPublicityData = (state, action) => {
    return updatedObject(state, {
        INIT_pubProducts: action.pubProducts,
        INIT_homePageProducts: action.homePageProducts,
        currentPubProducts: action.pubProducts,
        currentHomePageProducts: action.homePageProducts,

    })
}

const cancelPublicityEditingMode = (state, action) => {
    if(action.section === 'publicity'){
        return updatedObject(state, {
            currentPubProducts: state.INIT_pubProducts,
            selectedPubProducts: [],
            editingMode: state.editingMode.filter(mode => mode !== action.section),
            selectorSelectedProductsIds: [],
            selectorSelectedProductsDetails: [],
            newPubProducts: []
        })
    }

    if(action.section === 'home page'){
        return updatedObject(state, {
            currentHomePageProducts: state.INIT_homePageProducts,
            selectedHomePageProducts: [],
            editingMode: state.editingMode.filter(mode => mode !== action.section),
            selectorSelectedProductsIds: [],
            selectorSelectedProductsDetails: [],
            newHomePageProducts: []
        })
    }
}

const togglePublicitySelector = (state, action) => {
    let requestedSection = null;

    /* SELECTOR CLOSED */
    if(!state.showSelector){
        requestedSection = action.section
    }

    return updatedObject(state, {
        showSelector: !state.showSelector,
        selectorTitle: requestedSection
    })
}

const setPublicitySelectorSelectedProducts = (state, action) => {
    return updatedObject(state, {
        selectorSelectedProductsIds: action.productsIds,
        selectorSelectedProductsDetails: action.productsDetails

    })
}

const addPublicityPubProducts = (state, action) => {
    return updatedObject(state, {
        newPubProducts: action.data,
        selectorSelectedProductsIds: [],
        selectorSelectedProductsDetails: []
    })
}

const addPublicityHomePageProducts = (state, action) => {
    return updatedObject(state, {
        newHomePageProducts: action.data,
        selectorSelectedProductsIds: [],
        selectorSelectedProductsDetails: []
    })
}



const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_PUBLICITY_DATA: return setPublicityData(state, action);
        case actionTypes.SET_PUBLICITY_EDITING_MODE: return updatedObject(state, {editingMode: action.editingMode});
        case actionTypes.SET_PUBLICITY_SELECTED_PUB_PRODUCTS: return updatedObject(state, {selectedPubProducts: action.data});
        case actionTypes.SET_PUBLICITY_SELECTED_HOMEPAGE_PRODUCTS: return updatedObject(state, {selectedHomePageProducts: action.data});
        case actionTypes.CANCEL_PUBLICITY_EDITING_MODE: return cancelPublicityEditingMode(state, action);
        case actionTypes.DELETE_PUBLICITY_SELECTED_PUB_PRODUCTS: return updatedObject(state, {currentPubProducts: action.data});
        case actionTypes.DELETE_PUBLICITY_SELECTED_HOMEPAGE_PRODUCTS: return updatedObject(state, {currentHomePageProducts: action.data});
        case actionTypes.TOGGLE_PUBLICITY_SELECTOR: return togglePublicitySelector(state, action);
        case actionTypes.SET_PUBLICITY_SELECTOR_SELECTED_PRODUCTS: return  setPublicitySelectorSelectedProducts(state, action)
        case actionTypes.ADD_PUBLICITY_PUB_PRODUCTS: return addPublicityPubProducts(state, action);
        case actionTypes.ADD__PUBLICITY__HOMEPAGE__PRODUCTS: return addPublicityHomePageProducts(state, action);

        default: return state
    }
}

export default reducer; 