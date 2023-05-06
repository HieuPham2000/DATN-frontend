import axios from 'axios';

/**
 * Thiết lập cơ bản cho API (base url, content type...)
 */
var httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-type': 'application/json',
    },
});

export default httpRequest;
