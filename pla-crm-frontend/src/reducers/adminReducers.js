import {
    ADMIN_USER_CREATE_REQUEST,
    ADMIN_USER_CREATE_SUCCESS,
    ADMIN_USER_CREATE_FAIL,
    ADMIN_USER_CREATE_RESET,

    ADMIN_USER_LIST_REQUEST,
    ADMIN_USER_LIST_SUCCESS,
    ADMIN_USER_LIST_FAIL
} from '../constants/adminConstants'


export const getUsersForAdminReducer  = (state = {loading: false, users: []}, action ) => {
    switch (action.type) {
        
        // currently fetching
        case ADMIN_USER_LIST_REQUEST:
            return {
                loading: true
            }
        // got the data
        case ADMIN_USER_LIST_SUCCESS:
            return {
                loading: false, 
                users: action.payload
            }
        // there was an error getting the data
        case ADMIN_USER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export const createNewUserReducer  = (state = {loading: false, user: {}}, action ) => {
    switch (action.type) {
        
        // currently fetching
        case ADMIN_USER_CREATE_REQUEST:
            return {
                loading: true
            }
        // got the data
        case ADMIN_USER_CREATE_SUCCESS:
            return {
                loading: false, 
                user: action.payload,
                success: true
            }
        // there was an error getting the data
        case ADMIN_USER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ADMIN_USER_CREATE_RESET:
            return {
                loading: false, 
                user: {}
            }
        default:
            return state;
    }
}