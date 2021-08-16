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
    CUSTOMER_SALES_ORDERS_REQUEST,
    CUSTOMER_SALES_ORDERS_SUCCESS,
    CUSTOMER_SALES_ORDERS_FAIL,
    CUSTOMER_SALES_LIST_REQUEST,
    CUSTOMER_SALES_LIST_SUCCESS,
    CUSTOMER_SALES_LIST_FAIL,
    
} from '../constants/customerConstants'

import {db, rdb, auth} from '../firebase';


export const getCustomerData = (customerID) => async (dispatch, getState) => {
        const {customerInfo} = getState().customerDetails
        
        // if there is a customer loaded and is the same as the one trying to be loaded just return
        // since the customer is already loaded
        if(Object.keys(customerInfo).length > 0){
            if(customerInfo.ListID === customerID) return
        }

        // Get the customer sales data
        dispatch(getCustomerSalesList(customerID))

        dispatch({
            type: CUSTOMER_DETAILS_REQUEST
        })
        db.collection('customers').doc(customerID).get()
        .then( doc => {
            if(doc.exists){
                let customerData = doc.data()
                if(!customerData.PriceLevelRef) {
                    customerData.PriceLevelRef = {
                        FullName: '0%',
                        ListID: ''
                    }
                }
                dispatch({
                    type: CUSTOMER_DETAILS_SUCCESS,
                    payload: customerData
                }) 
            } else{
                dispatch({
                    type: CUSTOMER_DETAILS_FAIL,
                    payload: `A customer with id: ${customerID} does not exist`
                })
            }
        })
        .catch( err => {
            dispatch({
                type: CUSTOMER_DETAILS_FAIL,
                payload: err
            })
        })


}

// Get the Sales List for a Customer 
export const getCustomerSalesList = (customerListID) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_SALES_LIST_REQUEST
    })


    // Get the sales 
    await rdb.ref(`salesList/${customerListID}`).get().then(snapshot => {
        if (snapshot.exists()) {
            dispatch({
                type: CUSTOMER_SALES_LIST_SUCCESS,
                payload: snapshot.val()
            })
        } else{
            dispatch({
                type: CUSTOMER_SALES_LIST_FAIL,
            })
        }
    })
}

// Get the customer list
export const getCustomerList = () => async (dispatch) => {
    dispatch({
        type: CUSTOMER_LIST_REQUEST,
    })
    try {
        const customerList = [
            {
                "AccountNumber" : "3454NY",
                "City" : "New York",
                "CompanyName" : "Michelle's Store",
                "FirstName" : "Michelle",
                "LastName" : "Hull",
                "ListID" : "8000000C-1476905929",
                "PostalCode" : "10007",
                "State" : "NY",
                "Street" : "3978 Angus Road"
            },
            {
                "AccountNumber" : "4232NM",
                "City" : "Albuquerque",
                "CompanyName" : "Los Pollos Hermanos",
                "FirstName" : "Gustavo",
                "LastName" : "Fring",
                "ListID" : "8000000D-1476989584",
                "PostalCode" : "87111",
                "State" : "NM",
                "Street" : "308 Negra Arroyo Lane"
            },
            {
                "AccountNumber" : "6745FL",
                "City" : "Miami Beach",
                "CompanyName" : "D Morgan Store",
                "FirstName" : "D",
                "LastName" : "Morgan",
                "ListID" : "8000000E-1477065451",
                "PostalCode" : "33154",
                "State" : "FL",
                "Street" : "2145 Dexter Hunt Road"
            }
        ]

        dispatch({
            type: CUSTOMER_LIST_SUCCESS,
            payload: customerList
        })

    //const getCustomerList = functions.httpsCallable('getCustomerList')

        // getCustomerList()
        // .then(result => {
        //     dispatch({
        //         type: CUSTOMER_LIST_SUCCESS,
        //         payload: result.data.customerlist
        //     })
        // })
        // .catch(err => {

        //     dispatch({
        //         type: CUSTOMER_LIST_FAIL,
        //         payload: err.message
        //     })
        // })
    } catch (err) {
        dispatch({
            type: CUSTOMER_LIST_FAIL,
            payload: err
        })
    }
}


// clear out Customer Details 
export const clearCustomerDetails = () => async (dispatch) => {
    dispatch({
        type: CUSTOMER_LIST_RESET,
    })
}

// clear out CustomerList 
export const clearCustomerList = () => async (dispatch) => {
    dispatch({
        type: CUSTOMER_DETAILS_RESET,
    })
}

export const getCustomerInvoices = (customerListID) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_INVOICES_REQUEST
    })
    // await to recevie the current user before proceeding
    await getCurrentUser(auth)
        

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // query to be performed
    let query = db.collection('invoices')

    //if query has state restrictions 
    if(claims?.restrictions?.states?.length > 0) {
        query = query.where('ShipAddress.State', 'in', claims.restrictions.states )
    }

    // filter by the account 
    query = query.where("CustomerRef.ListID","==",customerListID)

    // make query call
    query
    .get()
        .then( snap => {
            let result = []
                snap.forEach( doc => result.push(doc.data()) )

            dispatch({
                type: CUSTOMER_INVOICES_SUCCESS,
                payload: result
            })
        })
        .catch( err => {
            dispatch({
                type: CUSTOMER_INVOICES_FAIL,
                payload: err
            })
        })
}

export const getCustomerSalesOrders = (customerListID) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_SALES_ORDERS_REQUEST
    })
    // await to recevie the current user before proceeding
    await getCurrentUser(auth)
        

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // query to be performed
    let query = db.collection('salesorders')

    //if query has state restrictions 
    if(claims?.restrictions?.states?.length > 0) {
        query = query.where('ShipAddress.State', 'in', claims.restrictions.states )
    }

    // filter by the account 
    query = query.where("CustomerRef.ListID","==",customerListID)

    // make query call
    query
    .get()
        .then( snap => {
            let result = []
                snap.forEach( doc => result.push(doc.data()) )

            dispatch({
                type: CUSTOMER_SALES_ORDERS_SUCCESS,
                payload: result
            })
        })
        .catch( err => {
            dispatch({
                type: CUSTOMER_SALES_ORDERS_FAIL,
                payload: err
            })
        })
}


export const resetCustomerInfo = () => async (dispatch) => {
    dispatch({type: CUSTOMER_INVOICES_RESET})
}

export const getCustomerAppOrders = (customerListID) => async (dispatch, getState) => {
    dispatch({
        type: CUSTOMER_APP_ORDERS_REQUEST
    })

    try {
        // make query for the orders
        db.collection('orders')
        .where("CustomerRef.ListID","==",customerListID)
        .get()
            .then( snap => {
                let result = []
                    snap.forEach( doc => {
                        result.push({...doc.data(), id: doc.id})
                    } )

                dispatch({
                    type: CUSTOMER_APP_ORDERS_SUCCESS,
                    payload: result
                })
            })
            .catch( err => {
                dispatch({
                    type: CUSTOMER_APP_ORDERS_FAIL,
                    payload: err
                })
            })
    } catch (error) {
        dispatch({
            type: CUSTOMER_APP_ORDERS_FAIL,
            payload: error
        })
    }
    
}


function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }

