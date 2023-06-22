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
    let bodyFormData = new FormData();
    Avatar != null && bodyFormData.append('Avatar', Avatar);
    DisplayName != null && bodyFormData.append('DisplayName', DisplayName?.trim());
    FullName != null && bodyFormData.append('FullName', FullName?.trim());
    Birthday != null && bodyFormData.append('Birthday', Birthday);
    Position != null && bodyFormData.append('Position', Position?.trim());
    return http.patch('user/update_user_info', bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
