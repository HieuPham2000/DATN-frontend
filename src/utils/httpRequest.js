import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { Enum } from '~/utils/common/enumeration';

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

httpRequest.interceptors.response.use(
    (response) => {
        if (response && response.data && response.data.Status === Enum.ServiceResultStatus.Exception) {
            toast.error(HUSTConstant.ToastMessage.Exception);
        }
        return response;
    },
    (error) => {
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
        // if (!error.response) {
        //     toast.error('Please check your internet connection');
        // }

        return Promise.reject(error);
    },
);

export default httpRequest;
