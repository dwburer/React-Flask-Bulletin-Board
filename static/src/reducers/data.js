
import {
    RECEIVE_PROTECTED_DATA, FETCH_PROTECTED_DATA_REQUEST, RECEIVE_DATA, FETCH_DATA_REQUEST,
    SUBMIT_DATA_COMPLETE, SUBMIT_DATA_REQUEST
} from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PROTECTED_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROTECTED_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [RECEIVE_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [SUBMIT_DATA_COMPLETE]: (state, payload) => {
        Object.assign({}, state, {
            hasSubmittedPost: true,
            data: payload.data,
            isFetching: false,
            loaded: true,
        })
    },
    [SUBMIT_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
