import http from '~/utils/httpRequest';

export const getMe = () => {
    return http.get('user/me');
};

export const updatePassword = (oldPassword, newPassword) => {
    return http.put('user/update_password', { OldPassword: oldPassword, NewPassword: newPassword });
};

export const getUserInfo = () => {
    return http.get('user/get_user_info');
};

export const updateUserInfo = ({ Avatar, DisplayName, FullName, Birthday, Position }) => {
    let param = { Avatar, DisplayName, FullName, Birthday, Position };
    return http.patch('user/update_user_info', param);
};
