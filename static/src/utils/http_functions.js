/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token,
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function create_user(email, username, password) {
    return axios.post('/api/create_user', {
        email,
        username,
        password,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

export function get_all_posts() {
    return axios.get('/api/post');
}

export function create_post(token, title, body, location) {
    return axios.post(
        '/api/create_post',
        {
            title,
            body,
            location,
        },
        tokenConfig(token)
    );
}
