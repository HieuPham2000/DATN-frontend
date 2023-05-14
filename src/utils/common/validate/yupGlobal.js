import * as yup from 'yup';
import { REGEX_ONLY_NUMBER, REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD } from '~/utils/common/constant';

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
        message: message || 'Password must be from 8-16 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
        excludeEmptyString: true,
    });
});

export default yup;
