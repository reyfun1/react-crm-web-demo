import {
    NOTE_CREATE_REQUEST,
    NOTE_CREATE_SUCCESS,
    NOTE_CREATE_FAIL,

    NOTE_FEED_REQUEST,
    NOTE_FEED_SUCCESS,
    NOTE_FEED_FAIL,
    NOTE_FEED_RESET,
    NOTE_FEED_DISABLE_SHOW_MORE,

    NOTE_DETAILS_REQUEST,
    NOTE_DETAILS_SUCCESS,
    NOTE_DETAILS_FAIL,
    NOTE_DETAILS_RESET,

    NOTE_CUSTOMER_FEED_REQUEST,
    NOTE_CUSTOMER_FEED_SUCCESS,
    NOTE_CUSTOMER_FEED_FAIL,
    NOTE_CUSTOMER_FEED_RESET
    

} from '../constants/noteConstants'

export const noteCreateReducer = (state = {loading: false, note: {}}, action) => {
    switch (action.type) {
        // currently fetching
        case NOTE_CREATE_REQUEST:
            return {
                loading: true
            }
        // got the data
        case NOTE_CREATE_SUCCESS:
            return {
                loading: false, 
                success: true,
                note: action.payload
            }
        // there was an error getting the data
        case NOTE_CREATE_FAIL:
            return {
                loading: false, 
                error: action.payload
            }
        default:
            return state;
    }
}


export const getNotesReducer  = (state = {loading: false, notes: [], error: false}, action ) => {
    switch (action.type) {
        // currently fetching
        case NOTE_FEED_REQUEST:
            return {
                loading: true
            }
        // got the data
        case NOTE_FEED_SUCCESS:
            return {
                ...state,
                loading: false, 
                notes: action.payload
            }
        // got the data
        case NOTE_FEED_DISABLE_SHOW_MORE:
            return {
                ...state,
                disableShowMore: action.payload
            }
        // there was an error getting the data
        case NOTE_FEED_FAIL:
            return {
                loading: false, 
                error: action.payload
            }
        case NOTE_FEED_RESET:
            return {loading: false}
        default:
            return state;
    }
}

export const getNotesForCustomerReducer  = (state = {loading: false, notes: []}, action ) => {
    switch (action.type) {
        // currently fetching
        case NOTE_CUSTOMER_FEED_REQUEST:
            return {
                loading: true
            }
        // got the data
        case NOTE_CUSTOMER_FEED_SUCCESS:
            return {
                loading: false, 
                notes: action.payload
            }
        // there was an error getting the data
        case NOTE_CUSTOMER_FEED_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case NOTE_CUSTOMER_FEED_RESET:
            return {loading: false}
        default:
            return state;
    }
}


export const getNoteDetailsReducer = (state = {loading: false, note: {}}, action) => {
    switch (action.type) {
        case NOTE_DETAILS_REQUEST:
            return {
              loading: true ,
              note: {} 
            }
        case NOTE_DETAILS_SUCCESS:
            return {
                loading: false,
                note: action.payload 
            }
        case NOTE_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload  
            }
        case NOTE_DETAILS_RESET:
            return {
                loading: false  
            }
        default:
            return state
    }
}