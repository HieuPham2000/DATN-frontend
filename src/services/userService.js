import http from '~/utils/httpRequest';

export const getMe = () => {
    return http.get('user/me');
};

export const updatePassword = (oldPassword, newPassword) => {
    return http.put('account/update_password', { OldPassword: oldPassword, NewPassword: newPassword });
};
