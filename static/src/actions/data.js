import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA, FETCH_DATA_REQUEST, RECEIVE_DATA } from '../constants/index';
import { parseJSON } from '../utils/misc';
import {create_post, data_about_user, get_all_posts} from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import {SUBMIT_DATA_COMPLETE, SUBMIT_DATA_REQUEST} from "../constants";

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function receiveData(data) {
    return {
        type: RECEIVE_DATA,
        payload: {
            data,
        },
    };
}

export function fetchDataRequest() {
    return {
        type: FETCH_DATA_REQUEST,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}


export function fetchData() {
    return (dispatch) => {
        dispatch(fetchDataRequest());
        get_all_posts()
            .then(parseJSON)
            .then(response => {
                dispatch(receiveData(response));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function submitDataRequest(token) {
    return {
        type: SUBMIT_DATA_REQUEST,
    };
}


export function submitDataComplete(data) {
    return {
        type: SUBMIT_DATA_COMPLETE,
        payload: {
            data,
        },
    };
}


export function postProtectedData(token, title, body, location) {
    return (dispatch) => {
        dispatch(submitDataRequest());
        create_post(token, title, body, location)
            .then(parseJSON)
            .then(response => {
                dispatch(submitDataComplete(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
