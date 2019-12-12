import * as actionTypes from './actionsTypes';


export const toggleShowFullNavbar = () => {
    return {
        type: actionTypes.TOGGLE_SHOW_FULL_NAVBAR
    }
}

export const initNotifications = data => {
    return {
        type: actionTypes.INIT_NOTIFICATIONS,
        notifData: data
    }
}


export const addANotification = data => {
    return  {
        type: actionTypes.ADD_A_NOTIFICATION,
        userId: data.userId
    }
}

export const substractANotification = userId => {
    return {
        type: actionTypes.SUBSTRACT_A_NOTIFICATION,
        userId: userId
    }
}

