import * as actionTypes from './actionsTypes';


export const setSuppliers = suppliers => {
    return {
        type: actionTypes.SET_SUPPLIERS,
        suppliers: suppliers
    }
}