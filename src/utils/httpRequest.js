import axios, { AxiosError, HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import HUSTConstant, { USER_SESSION } from '~/utils/common/constant';
import { Enum } from '~/utils/common/enumeration';
import { clearSessionInStorage, getSessionInStorage, setSessionInStorage } from '~/utils/storage';

/**
 * Thiết lập cơ bản cho API (base url, content type...)
 */
var httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    timeout: 120000,
    headers: {
        'Content-type': 'application/json',
    },
});

const setRequestSession = (sessionId) => {
    httpRequest.defaults.headers.common[USER_SESSION] = sessionId;
};

const clearRequestSession = () => {
    httpRequest.defaults.headers.common[USER_SESSION] = null;
};

export const setUserSession = (sessionId) => {
    // if (process.env.NODE_ENV === 'development') {
    //     setSessionInStorage(sessionId);
    //     setRequestSession(sessionId);
    // }
    setSessionInStorage(sessionId);
    setRequestSession(sessionId);
};

export const clearUserSession = () => {
    // if (process.env.NODE_ENV === 'development') {
    //     clearSessionInStorage();
    //     clearRequestSession();
    // }
    clearSessionInStorage();
    clearRequestSession();
};

(() => {
    const sessionId = getSessionInStorage();
    setRequestSession(sessionId);
})();

httpRequest.interceptors.response.use(
    (response) => {
        if (response && response.data && response.data.Status === Enum.ServiceResultStatus.Exception) {
            toast.error(HUSTConstant.ToastMessage.Exception);
        }
        return response;
    },
    (error) => {
        if (!error.response) {
            switch (error.code) {
                case AxiosError.ECONNABORTED:
                case AxiosError.ETIMEDOUT:
                    toast.error(HUSTConstant.ToastMessage.Timeout);
                    break;
                case AxiosError.ERR_NETWORK:
                    toast.error(HUSTConstant.ToastMessage.ServerOff);
                    break;
                default:
                    break;
            }
        } else {
            switch (error.response.status) {
                case HttpStatusCode.Unauthorized:
                    // if (error.config?.url !== 'user/me' && window.location.pathname !== '/login') {
                    //     window.location.replace('/login');
                    // }
                    if (window.location.pathname !== '/login') {
                        window.location.replace('/login');
                    }
                    break;
                case HttpStatusCode.InternalServerError:
                case HttpStatusCode.BadGateway:
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                    break;
                default:
                    break;
            }
        }

        return Promise.reject(error);
    },
);

export default httpRequest;
