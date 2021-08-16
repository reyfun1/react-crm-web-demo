import {
    ENVIRONMENT_VAR_REQUEST,
    ENVIRONMENT_VAR_SUCCESS,
    ENVIRONMENT_VAR_FAIL,
    ENVIRONMENT_VAR_RESET
} from '../constants/environmentVariablesConstants'


export const environmentVariablesReducer = (state = { lists: {}}, action) => {
    switch (action.type) {
        case ENVIRONMENT_VAR_REQUEST:
            return { loading: true }
        case ENVIRONMENT_VAR_SUCCESS:
            return { loading: false, lists: action.payload }
        case ENVIRONMENT_VAR_FAIL:
            return { loading: false, error: action.payload }
        case ENVIRONMENT_VAR_RESET:
            return { }
        default:
            return state;
    }
}