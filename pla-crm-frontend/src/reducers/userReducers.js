import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_RESET,
    USER_LOGOUT,
    USER_LOGOUT_ERROR,
    USER_CREATE_REQUEST,
    USER_CREATE_SUCCESS,
    USER_CREATE_FAIL
} from '../constants/userConstants'


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        // currently fetching
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGIN_RESET:
            return { }
        case USER_LOGOUT:
            return { }
        case USER_LOGOUT_ERROR:
            return { loading: false, error: action.payload}
        default:
            return state;
    }
}

export const userCreateReducer = (state = {loading: false, userCreated: {}}, action) => {
    switch (action.type) {
        case USER_CREATE_REQUEST:
            return { loading: true }
        case USER_CREATE_SUCCESS:
            return { loading: false, userCreated: action.payload }
        case USER_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}
