import { createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// IMPORT REDUCERS HERE 
import { userLoginReducer } from './reducers/userReducers'
import { customerDetailsReducer, customerListReducer,customerInvoicesReducer, customerAppOrdersReducer, customerSalesOrdersReducer, customerSalesListReducer} from './reducers/customerReducers'
import { sideNavReducer } from './reducers/sideNavReducer'
import { environmentVariablesReducer} from './reducers/environmentVariablesReducers'
import { noteCreateReducer, getNotesReducer, getNoteDetailsReducer, getNotesForCustomerReducer } from './reducers/noteReducers'
import { orderCreateReducer, getOrdersReducer, getOrdersDetailsReducer, orderChangeStatus } from './reducers/orderReducers'
import { getUsersForAdminReducer, createNewUserReducer} from './reducers/adminReducers'
import { invoiceListReducer } from './reducers/invoiceReducers'

// COMBINE THE REDUCERS HERE 
const reducer = combineReducers({
    userLogin: userLoginReducer,
    customerDetails : customerDetailsReducer,
    customerInvoices : customerInvoicesReducer,
    customerAppOrders : customerAppOrdersReducer,
    customerSalesOrders : customerSalesOrdersReducer,
    customerNotes: getNotesForCustomerReducer,
    customerList : customerListReducer,
    customerSalesList: customerSalesListReducer,
    invoiceList : invoiceListReducer,
   // salesOrderList : salesOrderListReducer,
    orderCreate: orderCreateReducer,
    ordersFeed : getOrdersReducer,
    orderDetails: getOrdersDetailsReducer,
    orderChangeStatus: orderChangeStatus,
    sideNav: sideNavReducer,
    environmentVariables: environmentVariablesReducer,
    noteCreate: noteCreateReducer,
    notesFeed : getNotesReducer,
    noteDetails: getNoteDetailsReducer,
    adminUserList: getUsersForAdminReducer,
    adminCreateNewUser: createNewUserReducer
    
})

// check if there is avaible user info in storage 
const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null

//DEFINE THE INITIAL STATE 
const initialState = {
    userLogin: {
        userInfo : userInfoFromStorage
    },
    customerDetails: {
        customerInfo: {}
    },
    notesFeed : {
        loading: false,
        notes: [],
        disableShowMore: false,
        error: false
    },
    ordersFeed : {
        loading: false,
        orders: [],
        disableShowMore: false,
        error: false
    },
    noteDetails : {
        loading: false,
        note: {},
    },
    orderDetails : {
        loading: false,
        order: {},
    },
    orderCreate : {
        loading: false,
        order:{}
    },
    environmentVariables : {
        lists : {
            itemList : {
                inventoryItems: {},
                inventoryServices : {}
            },
            noteTypes: {},
            orderForms: {
                standard : {
                    products: {}
                }
            },
            priceLevelList : {},
            repList : {},
            termList: {}
        }
    }

}

// CREATE THE STORE
const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store