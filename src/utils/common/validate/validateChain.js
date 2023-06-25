import { REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD } from '~/utils/common/constant';

const MyValidateChain = function () {
    this.valid = true;
    this.msg = null;
};

MyValidateChain.prototype.onValid = function () {
    this.valid = true;
    this.msg = null;
    return this;
};

MyValidateChain.prototype.onError = function (msg) {
    this.valid = false;
    this.msg = msg;
    return this;
};

MyValidateChain.prototype.validateRequireField = function (value, displayFieldName) {
    if (!this.valid) {
        return this;
    }
    if (!value) {
        return this.onError(`${displayFieldName || 'This field'} is required.`);
    }

    return this.onValid();
};

MyValidateChain.prototype.validateEmail = function (value) {
    if (!this.valid) {
        return this;
    }
    if (!value.match(REGEX_TEST_EMAIL)) {
        return this.onError(`Incorrect email format.`);
    }
    return this.onValid();
};

MyValidateChain.prototype.validatePassword = function (value) {
    if (!this.valid) {
        return this;
    }
    if (!value.match(REGEX_TEST_PASSWORD)) {
        return this.onError(
            `Password must be from 8-16 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.`,
        );
    }
    return this.onValid();
};

MyValidateChain.prototype.validateMatchField = function (value1, value2, displayFieldNames) {
    if (!this.valid) {
        return this;
    }
    if (value1 !== value2) {
        return this.onError(`${displayFieldNames || 'Fields'} don't match.`);
    }
    return this.onValid();
};

export { MyValidateChain };
