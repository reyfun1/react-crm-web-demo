import {
    INVOICES_LIST_REQUEST,
    INVOICES_LIST_SUCCESS,
    INVOICES_LIST_FAIL,

    INVOICES_LIST_DISABLE_SHOW_MORE,
} from '../constants/invoiceConstants'

import {db} from '../firebase'
import {auth} from '../firebase'

// Get the invoice list
export const getInvoiceList = (filterInfo, lastDate) => async (dispatch, getState) => {

    // get previous notes stattes
    const { invoiceList } = getState()
    const invoiceFromPrevStates = invoiceList.invoiceList

    // if it comes from showmore do not dispatch to load
    if(!lastDate){
        dispatch({
            type: INVOICES_LIST_REQUEST,
        })
    }

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

    // add extra-filters
    if(filterInfo){
        Object.keys(filterInfo).forEach(filterField => {
            if(filterInfo[filterField] !== 'Any'){
                switch (filterField) {
                    case 'Invoice #':
                        query = query.where('RefNumber', '==', filterInfo[filterField] )
                        break;
                    case 'Name':
                        query = query.where('CustomerRef.FullName', '==',filterInfo[filterField] )
                        break;
                    case 'State':
                        query = query.where('ShipAddress.State', '==',filterInfo[filterField] )
                        break;
                    case 'Date':
                        /// TODO: Need to convert to the actual "2018-1-19" format
                        query = query.where('TxnDate', '==',filterInfo[filterField] )
                        break;
                    case 'Amount':
                        query = query.where('Subtotal', '==',filterInfo[filterField] )
                        break;
                    
                    default:
                        break;
                }
            }
        })
    }

    // add limits
    query = query.limit(30)

    // add sorting
    query = query.orderBy("TxnDate", "desc")

    // add pagination
    if(lastDate){
        query = query.startAfter(lastDate)
    }


    // request the query 
    query.get()
        .then(snap => {
            let result = []
            snap.forEach(doc => result.push({...doc.data(), id : doc.id }))

            //if it is a query to load more, add to current array
            if(lastDate){
                // if result is empty, disable load more 
                if(result.length < 1){
                    dispatch({
                        type: INVOICES_LIST_DISABLE_SHOW_MORE,
                        payload: true
                    })
                }
                result = [...result, ...invoiceFromPrevStates ]

                
            }

            dispatch({
                type: INVOICES_LIST_SUCCESS,
                payload: result
            })
            
            

        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: INVOICES_LIST_FAIL,
                payload: err
            })   
        })
}

function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }

