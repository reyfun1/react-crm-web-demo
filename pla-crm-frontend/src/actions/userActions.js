import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_LOGOUT_ERROR,
} from '../constants/userConstants'

import { auth } from '../firebase' 

// Update the login state with persistance
export const loginWithPersistance = () => async (dispatch) => {

        if(auth.currentUser){
            // get the custopm claims for the user
            auth.currentUser.getIdTokenResult()
            .then( idTokenResult => {
                
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {...auth.currentUser, ...{ claims: idTokenResult.claims }}
                })
                // save user data to localStorage
                localStorage.setItem('userInfo', JSON.stringify(auth.currentUser))
            })
            .catch(err => {
                dispatch({
                    type:  USER_LOGIN_FAIL,
                    payload : err
                })
            })

        }
}

export const login = (email, password) => async (dispatch) => {
    dispatch({
        type: USER_LOGIN_REQUEST
    })

    auth.signInWithEmailAndPassword(email, password)
    .then((data) => {
        // get the custopm claims for the user
        auth.currentUser.getIdTokenResult()
        .then( idTokenResult => {
            
            dispatch({
                type:  USER_LOGIN_SUCCESS,
                payload : {...data, ...{ claims: idTokenResult.claims }}
            })
            // save user data to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data))
        })
        .catch(err => {
            dispatch({
                type:  USER_LOGIN_FAIL,
                payload : err
            })
        })

        
    })
    .catch((error) => {
        dispatch({
            type:  USER_LOGIN_FAIL,
            payload : error
        })
        // const errorCode = error.code;
        // const errorMessage = error.message;
    });
    
}



export const logout = () => async (dispatch) => {

    auth.signOut()
    .then(() => {
        dispatch({
            type:  USER_LOGOUT,
        })
        // remove user from storage
        localStorage.removeItem('userInfo')
    })
    .catch((error) => {
        dispatch({
            type:  USER_LOGOUT_ERROR,
            payload : error
        })
        // const errorCode = error.code;
        // const errorMessage = error.message;
    });
    
}

export const createUser = () => async (dispatch) => {
    console.log('create user here')
}