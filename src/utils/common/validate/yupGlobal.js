import * as yup from 'yup';
import HUSTConstant, { REGEX_ONLY_NUMBER, REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD } from '~/utils/common/constant';

yup.addMethod(yup.string, 'email', function (message) {
    return this.matches(REGEX_TEST_EMAIL, {
        message: message || 'Incorrect email format.',
        excludeEmptyString: true,
    });
});

yup.addMethod(yup.string, 'onlyNumber', function (message) {
    return this.matches(REGEX_ONLY_NUMBER, {
        message,
        excludeEmptyString: true,
    });
});

yup.addMethod(yup.string, 'password', function (message) {
    return this.matches(REGEX_TEST_PASSWORD, {
        message: message || HUSTConstant.ValidateMessage.Password,
        excludeEmptyString: true,
    });
});

yup.addMethod(yup.string, 'textHtmlRequired', function (message) {
    return this.test('textHtmlRequired', message, (value) => !!value?.replaceAll(/<.*?>/g, '')?.trim());
});

yup.addMethod(yup.string, 'textHtmlMaxLength', function (limit, message) {
    return this.test('textHtmlMaxLength', message, (value) => (value?.replaceAll(/<.*?>/g, '')?.length || 0) <= limit);
});

export default yup;
