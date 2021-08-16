import {
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_FAIL,
    ORDER_FEED_REQUEST,
    ORDER_FEED_SUCCESS,
    ORDER_FEED_FAIL,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_FEED_DISABLE_SHOW_MORE,

    ORDER_CHANGE_STATUS_REQUEST,
    ORDER_CHANGE_STATUS_SUCCESS,
    ORDER_CHANGE_STATUS_FAIL


} from '../constants/orderConstants'

import {db} from '../firebase';
import {auth} from '../firebase'

export const createOrder = order => async (dispatch, getState) => {
    dispatch({
        type: ORDER_CREATE_REQUEST,
    })

    try {
        db.collection("orders").add(order)
        .then(doc =>  {
            dispatch({
                type: ORDER_CREATE_SUCCESS,
                payload: {...order,id: doc.id}
            })
        })
        .catch(error => {
            dispatch({
                type: ORDER_CREATE_FAIL,
                payload: error
            })
            console.log(error)
        })
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error
        })
    }


}

export const setOrderStatus = (status,orderID) => async (dispatch, getState) => {
    dispatch({
        type: ORDER_CHANGE_STATUS_REQUEST,
    })

    // change actual item in db
    db.collection('orders').doc(orderID).update({
        OrderStatus: status
    }).then( () => {
        dispatch({
            type: ORDER_CHANGE_STATUS_SUCCESS,
        })
        // Populate the order page with changed order
        dispatch(getOrderDetails(orderID))
    }).catch(error => {
        dispatch({
            type: ORDER_CHANGE_STATUS_FAIL,
            payload: error
        })
    })

}

export const getOrders = (dates, filterInfo, lastDate) => async (dispatch, getState) => {

    let isRep = false

    // get prev order state 
    const { ordersFeed } = getState()
    const ordersFromPrevState = ordersFeed.orders

    // if it comes from showmore, do not dispatch load 
    if(!lastDate){
        dispatch({
            type: ORDER_FEED_REQUEST,
        })
    }

    // await to recevie the current user before proceeding
    await getCurrentUser(auth)

    // get the claims from the user 
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // query to be performed
    let query = db.collection('orders')
    let query2 = db.collection('orders')

    //if query has state restrictions 
    if(claims?.restrictions?.states?.length > 0) {
        isRep = true
        query = query.where('CustomerRef.State', 'in', claims.restrictions.states )
        query2 = query2.where('NewCustomerRef.ShipAddress.State', 'in', claims.restrictions.states )
        // query2 = query2.where('NewCustomer', '==', true )
    }

    // add time-frame filters 
    query = query.where('TimeStamp', '>=', dates.from)
    query = query.where('TimeStamp', '<=', dates.to)

    query2 = query2.where('TimeStamp', '>=', dates.from)
    query2 = query2.where('TimeStamp', '<=', dates.to)

    // TODO: add extra filters...

    // add limits 
    query = query.limit(50)
    query2 = query2.limit(50)

    // add sorting from newest to olders
    query = query.orderBy("TimeStamp", "desc")
    query2 = query2.orderBy("TimeStamp", "desc")

    // add pagination if request comes from load more 
    if(lastDate){
        query = query.startAfter(lastDate)
        query2 = query2.startAfter(lastDate)
    }
        // request the query 
        query.onSnapshot(async snap => {
            let result = []
            snap.forEach(doc => result.push({...doc.data(), id : doc.id }))

            if(isRep){
                await query2.get().then( snap2 => {
                    snap2.forEach(doc2 => { 
                        result.push({...doc2.data(), id : doc2.id })
                    })
                })
            }

            // if it is a query to load more, add to current array
            if(lastDate){
                // if result is empty, disable load more 
                if(result.length < 1){
                    dispatch({
                        type: ORDER_FEED_DISABLE_SHOW_MORE,
                        payload: true
                    })
                }
                result = [...result, ...ordersFromPrevState ]

            }

            dispatch({
                type: ORDER_FEED_SUCCESS,
                payload: result
            })

        }, err => {
            dispatch({
                type: ORDER_FEED_FAIL,
                payload: err
            })   
        })

    


}

export const getOrderDetails = (orderId) => async(dispatch,getState) =>{
    // check if order is already on the notes feed list 

    dispatch({
        type: ORDER_DETAILS_REQUEST
    })

    // extract info of the logeed in user and of the order list 
    const {userLogin: {userInfo}} = getState();
    const {ordersFeed: {orders}} = getState();
    const {customerAppOrders: {customerAppOrders}} = getState();

    const foundOrderInOrderFeed = orders.find(order => order.id === orderId)
    const foundOrderInCustomerPage = customerAppOrders.find(order => order.id === orderId)

    if(foundOrderInOrderFeed){
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: foundOrderInOrderFeed
        })
    } else if(foundOrderInCustomerPage){
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: foundOrderInCustomerPage
        })
    } else{
        console.log("had to get from the database")
        db.collection('orders').doc(orderId).onSnapshot(doc => {
            dispatch({
                type: ORDER_DETAILS_SUCCESS,
                payload: {...doc.data(), id: doc.id}
            })
        }, err => {
           dispatch({
               type: ORDER_DETAILS_FAIL,
               err:err
           })  
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


