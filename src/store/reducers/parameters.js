import * as actionTypes from '../actions/actionsTypes';
import { updatedObject} from '../utility';

const initialState = {
    lang: 'english',
    currency: 'CAD',
    quotes: {

        USDCAD : 1.32357,
        USDEUR : 0.92693,

        // USDCAD : 1.32,
        // USDEUR : 0.92,
        
        EURUSD: 1.0788,  // 1 EUR = 1.07 USD
        EURCAD: 1.4289,

        CADUSD: 0.7555,
        CADEUR: 0.6998,


        


      
        
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.SET_LANG : return updatedObject(state, { lang: action.lang});
        case actionTypes.SET_CURRENCY : return updatedObject(state, { currency: action.currency});
        default: return state
    }
}

export default reducer