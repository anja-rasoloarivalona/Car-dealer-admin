import * as actionTypes from '../actions/actionsTypes';
import {updatedObject } from '../utility';



const initialState = {
    showFullNavbar: false,
    notification: []
}


const addANotification = (state, action) => {
    let notificationUpdated;

    if(state.notification.includes(action.userId)){
        console.log('already here')
        return state

    } else {
        console.log('not yet')
        notificationUpdated = [...state.notification, action.userId ];
        return updatedObject( state, {notification: notificationUpdated})
    }
   
}

const substractANotification = (state, action) => {

    let notificationUpdated = state.notification.filter( i => i !== action.userId );
   
    return updatedObject( state, {notification: notificationUpdated})


}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.TOGGLE_SHOW_FULL_NAVBAR : return updatedObject(state, {showFullNavbar: !state.showFullNavbar} );

        case actionTypes.INIT_NOTIFICATIONS: return updatedObject(state, {notification: action.notifData});


        case actionTypes.ADD_A_NOTIFICATION: return addANotification(state, action);
        
        case actionTypes.SUBSTRACT_A_NOTIFICATION: return substractANotification(state, action)
        default: return state
    }
}

export default reducer;