import * as actionTypes from '../actions/actionsTypes';
import {updatedObject } from '../utility';


const initialState = {
    productRequested: {},
    productRequestedId: '',
    editingMode: false,
    products: [],
    brandsAndModels: null,
    totalProducts: null,

    productsQueries: null,
    savedProductsQueries: false
}


const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_REQUESTED_PRODUCT : return updatedObject(state, {productRequested: action.product});
        case actionTypes.SET_REQUESTED_PRODUCT_ID: return updatedObject(state, {productRequestedId: action.id});
        case actionTypes.TOGGLE_EDITING_MODE: return updatedObject(state, {editingMode: !state.editingMode});
        case actionTypes.SET_PRODUCTS: return updatedObject(state, {products: action.products});
        case actionTypes.SET_BRANDS_AND_MODELS: return updatedObject(state, {brandsAndModels: action.brandsAndModels});
        case actionTypes.SET_TOTAL_PRODUCTS: return updatedObject(state, {totalProducts: action.totalProducts});
        case actionTypes.ADD_TOTAL_PRODUCTS: return updatedObject(state, {totalProducts: state.totalProducts + 1});
        case actionTypes.SET_PRODUCTS_QUERIES: return updatedObject(state, {productsQueries: action.data});
        case actionTypes.SET_SAVED_PRODUCTS_QUERIES_TO_TRUE: return updatedObject(state, {savedProductsQueries: true})
    
        default: return state
    }
}


export default reducer;