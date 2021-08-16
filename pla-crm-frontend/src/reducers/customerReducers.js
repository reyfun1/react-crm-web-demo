import {
    CUSTOMER_DETAILS_REQUEST,
    CUSTOMER_DETAILS_SUCCESS,
    CUSTOMER_DETAILS_FAIL,
    CUSTOMER_DETAILS_RESET,
    CUSTOMER_LIST_REQUEST,
    CUSTOMER_LIST_SUCCESS,
    CUSTOMER_LIST_FAIL,
    CUSTOMER_LIST_RESET,
    CUSTOMER_INVOICES_REQUEST,
    CUSTOMER_INVOICES_SUCCESS,
    CUSTOMER_INVOICES_FAIL,
    CUSTOMER_INVOICES_RESET,
    CUSTOMER_APP_ORDERS_REQUEST,
    CUSTOMER_APP_ORDERS_SUCCESS,
    CUSTOMER_APP_ORDERS_FAIL,
    CUSTOMER_APP_ORDERS_RESET,
    CUSTOMER_SALES_ORDERS_REQUEST,
    CUSTOMER_SALES_ORDERS_SUCCESS,
    CUSTOMER_SALES_ORDERS_FAIL,
    CUSTOMER_SALES_LIST_REQUEST,
    CUSTOMER_SALES_LIST_SUCCESS,
    CUSTOMER_SALES_LIST_FAIL,
    CUSTOMER_SALES_LIST_RESET
} from '../constants/customerConstants'


export const customerDetailsReducer = (state = {customerInfo : {}}, action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_DETAILS_REQUEST:
            return {
                loading: true,
                customerInfo : {}
            }
        // got the data
        case CUSTOMER_DETAILS_SUCCESS:
            return {
                loading: false, customerInfo: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_DETAILS_FAIL:
            return {
                loading: false, error: action.payload
            }
        case CUSTOMER_DETAILS_RESET:
            return {customerInfo : {}}
        default:
            return state;
    }
}

export const customerInvoicesReducer = (state = {loading: false, customerInvoices : []}, action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_INVOICES_REQUEST:
            return {
                loading: true
            }
        // got the data
        case CUSTOMER_INVOICES_SUCCESS:
            return {
                loading: false, customerInvoices: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_INVOICES_FAIL:
            return {
                loading: false, error: action.payload
            }
        case CUSTOMER_INVOICES_RESET:
            return {
                loading: false, customerInvoices : []
            }
        default:
            return state;
    }
}

export const customerAppOrdersReducer = (state = {loading: false, customerAppOrders : []}, action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_APP_ORDERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        // got the data
        case CUSTOMER_APP_ORDERS_SUCCESS:
            return {
                loading: false, customerAppOrders: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_APP_ORDERS_FAIL:
            return {
                loading: false, error: action.payload
            }
        case CUSTOMER_APP_ORDERS_RESET:
            return {
                loading: false, customerAppOrders : []
            }
        default:
            return state;
    }
}

export const customerSalesOrdersReducer = (state = {loading: false, customerSalesOrders : []}, action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_SALES_ORDERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        // got the data
        case CUSTOMER_SALES_ORDERS_SUCCESS:
            return {
                loading: false, customerSalesOrders: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_SALES_ORDERS_FAIL:
            return {
                loading: false, error: action.payload
            }
        default:
            return state;
    }
}

export const customerSalesListReducer = (state = {loading: false, salesList : {}}, action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_SALES_LIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        // got the data
        case CUSTOMER_SALES_LIST_SUCCESS:
            return {
                loading: false, salesList: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_SALES_LIST_FAIL:
            return {
                loading: false, error: action.payload
            }
        default:
            return state;
    }
}



export const customerListReducer = (state = {customerList: []},action) => {
    switch (action.type) {
        // currently fetching
        case CUSTOMER_LIST_REQUEST:
            return {
                loading: true,
                customerList: []
            }
        // got the data
        case CUSTOMER_LIST_SUCCESS:
            return {
                loading: false, 
                customerList: action.payload
            }
        // there was an error getting the data
        case CUSTOMER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CUSTOMER_LIST_RESET:
            return {
                loading: false,
                customerList: []
            }
        default:
            return state;
    }
}
