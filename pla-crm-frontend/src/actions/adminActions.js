import {
    ADMIN_USER_CREATE_REQUEST,
    ADMIN_USER_CREATE_SUCCESS,
    ADMIN_USER_CREATE_FAIL,

    ADMIN_USER_LIST_REQUEST,
    ADMIN_USER_LIST_SUCCESS,
    ADMIN_USER_LIST_FAIL
} from '../constants/adminConstants'

import {db, auth, functions} from '../firebase'


export const getUsersForAdmin = () => async (dispatch) => {
    dispatch({
        type: ADMIN_USER_LIST_REQUEST,
    })
    // await to recevie the current user before proceeding
    await getCurrentUser(auth)

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // check if signed user is an admin,, if not go back
    if(!claims.admin) {
        dispatch({
            type: ADMIN_USER_LIST_FAIL,
            payload: 'Not Authorized'
        })
        return
    }

    // query to be performed
    let query = db.collection('users')


    // request the query 

    query.onSnapshot(snap=>{
        let result = []
            snap.forEach(doc => result.push({...doc.data(), id : doc.id }))
            dispatch({
                type: ADMIN_USER_LIST_SUCCESS,
                payload: result
            })
    }, err => {
        dispatch({
            type: ADMIN_USER_LIST_FAIL,
            payload: err.mesage
        })  
    })
}

export const createNewUser = newUser => async (dispatch) => {
    dispatch({
        type: ADMIN_USER_CREATE_REQUEST,
    })

    // function that creates a new user
    const createUser = functions.httpsCallable('createUser');

    // await to recevie the current user before proceeding
    await getCurrentUser(auth)

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // check if signed user is an admin,, if not go back
    if(!claims.admin) {
        dispatch({
            type: ADMIN_USER_CREATE_FAIL,
            payload: 'Not Authorized'
        })
        return
    }

    // Call the actual user
    createUser(newUser)
        .then(resp => {
          //Display success
          dispatch({
            type: ADMIN_USER_CREATE_SUCCESS,
            payload: resp
        })
        })
        .catch(error => {
            dispatch({
                type: ADMIN_USER_CREATE_FAIL,
                payload: error.message
            })
        });
}

 



function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }
