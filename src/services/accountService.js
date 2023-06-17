import http from '~/utils/httpRequest';

export const register = (userName, password) => http.post('account/register', { UserName: userName, Password: password });

export const sendActivateEmail = (userName, password) => http.post('account/send_activate_email', { UserName: userName, Password: password });
