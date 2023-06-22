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

export const login = (userName, password) => {
    return http.post('account/login', { UserName: userName, Password: password });
};

export const logout = () => {
    return http.get('account/logout');
};

export const forgotPassword = (email) => {
    return http.get('account/forgot_password', { params: { email } });
};

export const checkAccessResetPassword = (token) => {
    return http.get('account/check_access_reset_password', { params: { token } });
};

export const resetPassword = (token, newPassword) => {
    return http.put('account/reset_password', { Token: token, NewPassword: newPassword });
};

export const checkAuthenticate = () => {
    return http.get('account/check_authenticate');
};

export const getAccountInfo = () => {
    return http.get('account/get_account_info');
};
