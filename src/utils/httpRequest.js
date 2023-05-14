import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Thiết lập cơ bản cho API (base url, content type...)
 */
var httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-type': 'application/json',
    },
});

httpRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            toast.error('Please check your internet connection.');
        }

        return Promise.reject(error);
    },
);

export default httpRequest;
