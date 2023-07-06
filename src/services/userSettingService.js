import http from '~/utils/httpRequest';

export const getUserSettingByKey = (settingKey) => {
    return http.get('userSetting/get_user_setting_by_key', { params: { settingKey } });
};

export const saveUserSettingWithKey = (settingKey, settingValue) => {
    return http.post('userSetting/save_user_setting_with_key', {
        settingKey,
        settingValue: settingValue?.toString()?.trim()?.toLowerCase(),
    });
};
