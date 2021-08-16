import {
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_FAIL,
    ORDER_FEED_REQUEST,
    ORDER_FEED_SUCCESS,
    ORDER_FEED_FAIL,
    ORDER_FEED_RESET,
    ORDER_FEED_DISABLE_SHOW_MORE,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_RESET,

    ORDER_CHANGE_STATUS_REQUEST,
    ORDER_CHANGE_STATUS_SUCCESS,
    ORDER_CHANGE_STATUS_FAIL

} from '../constants/orderConstants'

export const orderCreateReducer = (state = {loading: false, order: {}}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return{
                ...state,
                loading:true
            }
        case ORDER_CREATE_SUCCESS:
            return{
                loading: false,
                success: true,
                order: action.payload
            }
        case ORDER_CREATE_FAIL:
            return{
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}

export const orderChangeStatus = (state = {loading: false}, action) => {
    switch (action.type) {
        case ORDER_CHANGE_STATUS_REQUEST:
            return{
                loading:true
            }
        case ORDER_CHANGE_STATUS_SUCCESS:
            return{
                loading: false,
                success: true,
            }
        case ORDER_CHANGE_STATUS_FAIL:
            return{
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}

export const getOrdersReducer  = (state = {loading: false, orders: [], error: false}, action ) => {
    switch (action.type) {
        // currently fetching
        case ORDER_FEED_REQUEST:
            return {
                loading: true
            }
        // got the data
        case ORDER_FEED_SUCCESS:
            return {
                ...state,
                loading: false, 
                orders: action.payload
            }
        case ORDER_FEED_DISABLE_SHOW_MORE:
            return {
                ...state,
                disableShowMore: action.payload
            }
        // there was an error getting the data
        case ORDER_FEED_FAIL:
            return {
                loading: false, 
                error: action.payload
            }
        case ORDER_FEED_RESET:
            return {loading: false}
        default:
            return state;
    }
}

export const getOrdersDetailsReducer  = (state = {loading: false, order: {}}, action ) => {
    switch (action.type) {
        // currently fetching
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
                order: {}
            }
        // got the data
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false, 
                order: action.payload
            }
        // there was an error getting the data
        case ORDER_DETAILS_FAIL:
            return {
                loading: false, 
                error: action.payload
            }
        case ORDER_DETAILS_RESET:
            return {loading: false}
        default:
            return state;
    }
}