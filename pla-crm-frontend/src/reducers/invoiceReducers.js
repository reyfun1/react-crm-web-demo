import {
    INVOICES_LIST_REQUEST,
    INVOICES_LIST_SUCCESS,
    INVOICES_LIST_FAIL,
    INVOICES_LIST_RESET,

    INVOICES_LIST_DISABLE_SHOW_MORE
} from '../constants/invoiceConstants'



export const invoiceListReducer = (state = {invoiceList: [], loading: false},action) => {
    switch (action.type) {
        // currently fetching
        case INVOICES_LIST_REQUEST:
            return {
                loading: true,
                invoiceList: []
            }
        // got the data
        case INVOICES_LIST_SUCCESS:
            return {
                loading: false, 
                invoiceList: action.payload
            }
        // there was an error getting the data
        case INVOICES_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case INVOICES_LIST_DISABLE_SHOW_MORE:
            return {
                ...state,
                disableShowMore: action.payload
            }
        case INVOICES_LIST_RESET:
            return {
                loading: false,
                invoiceList: []
            }
        default:
            return state;
    }
}