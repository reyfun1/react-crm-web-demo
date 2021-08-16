import {
    ENVIRONMENT_VAR_REQUEST,
    ENVIRONMENT_VAR_SUCCESS,
    ENVIRONMENT_VAR_FAIL,
} from '../constants/environmentVariablesConstants'


import {rdb} from '../firebase'

export const getEnvironmentVariables = () => async (dispatch) => {
    try{
        // set status to loading 
        dispatch({
            type: ENVIRONMENT_VAR_REQUEST,
        })

        await rdb.ref('/environementlists/').once('value', data => {
            dispatch({
                type: ENVIRONMENT_VAR_SUCCESS,
                payload: data.val()
            })
        }, err => {
            dispatch({
                type: ENVIRONMENT_VAR_FAIL,
                payload: err
            })
        })
    } catch(error){
        dispatch({
            type: ENVIRONMENT_VAR_FAIL,
            payload: error
        })
    }
}