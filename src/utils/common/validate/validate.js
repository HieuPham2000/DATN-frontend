import { validateHelper } from '~/utils/common/validate/validateHelper';

/**
 * Validate giá trị theo mảng rules
 * @param {*} validateRules mảng rule validate
 * @param {*} value giá trị cần validate
 * @param {*} data dữ liệu bổ sung
 * @returns [valid, msg]
 */
function validateWithRules(validateRules, value, data) {
    let valid = true,
        msg = null;

    if (validateRules && Array.isArray(validateRules) && validateRules.length > 0) {
        for (let rule of validateRules) {
            let [valid, msg] = validateHelper(rule, value, data);
            if (!valid) {
                return [valid, msg];
            }
        }
    } else if(validateRules && (typeof validateRules === 'string' || validateRules instanceof String)) {
        return validateHelper(validateRules, value, data);
    }

    return [valid, msg];
}

export { validateWithRules };
