import http from '~/utils/httpRequest';

export const register = (userName, password) => {
    return http.post('account/register', { UserName: userName, Password: password });
};

export const sendActivateEmail = (userName, password) => {
    return http.post('account/send_activate_email', { UserName: userName, Password: password });
};

export const activateAccount = (token) => {
    return http.get('account/activate_account', { params: { token } });
};
