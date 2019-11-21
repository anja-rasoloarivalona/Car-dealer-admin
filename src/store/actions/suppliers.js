import * as actionTypes from './actionsTypes';


export const setSuppliers = suppliers => {

    console.log('seetingtgtrg')
    return {
        type: actionTypes.SET_SUPPLIERS,
        suppliers: suppliers
    }
}