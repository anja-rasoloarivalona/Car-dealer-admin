import * as actionTypes from '../actions/actionsTypes';
import {updatedObject } from '../utility';


const initialState = {
    productRequested: {},
    productRequestedId: '',
    editingMode: false,
    products: [],
    brandAndModelsData: null,
    price: null,
    bodyTypeList: null,
    totalProducts: null,
    itemsPerPage: 20,
    currentInventoryPage: 1,
}

const initAppData = (state, action) => {
    return updatedObject( state, {
        brandAndModelsData: action.data.brandAndModelsData,
        price: action.data.price,
        bodyTypeList: action.data.bodyTypeList,
        totalProducts: action.data.totalProducts
    })
}


const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.INIT_APP_DATA: return initAppData(state, action);
        case actionTypes.SET_REQUESTED_PRODUCT : return updatedObject(state, {productRequested: action.product});
        case actionTypes.SET_REQUESTED_PRODUCT_ID: return updatedObject(state, {productRequestedId: action.id});
        case actionTypes.TOGGLE_EDITING_MODE: return updatedObject(state, {editingMode: !state.editingMode});
        case actionTypes.SET_PRODUCTS: return updatedObject(state, {products: action.products});     
        case actionTypes.ADD_TOTAL_PRODUCTS: return updatedObject(state, {totalProducts: state.totalProducts + 1});
        case actionTypes.SET_INVENTORY_CURRENT_PAGE: return updatedObject(state, {currentInventoryPage: action.page})

    
        default: return state
    }
}


export default reducer;