import HUSTConstant, { REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD } from '~/utils/common/constant';

/**
 * Hàm hỗ trợ validate theo từng loại
 * @param {string} type Loại validate
 * @param {*} value giá trị cần validate
 * @param {*} data dữ liệu bổ sung
 * @returns [valid, msg]
 */
const validateHelper = (type, value, data) => {
    let valid = true,
        msg = null;

    let { label, compareValue } = data;
    switch (type) {
        case HUSTConstant.ValidateType.Required:
            if (!value) {
                valid = false;
                msg = `${label || 'This field'} is required.`;
            }
            break;
        case HUSTConstant.ValidateType.Email:
            if (!value.match(REGEX_TEST_EMAIL)) {
                valid = false;
                msg = `Incorrect email format.`;
            }
            break;
        case HUSTConstant.ValidateType.Password:
            if (!value.match(REGEX_TEST_PASSWORD)) {
                valid = false;
                msg = `Password must be from 8-16 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.`;
            }
            break;
        case HUSTConstant.ValidateType.Match:
            if (value === compareValue) {
                valid = false;
                msg = `${label || 'Fields'} don't match.`;
            }
            break;
        default:
            break;
    }

    return [valid, msg];
};

export { validateHelper };
