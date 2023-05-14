const REGEX_TEST_EMAIL =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// At least one upper case English letter, (?=.*?[A-Z])
// At least one lower case English letter, (?=.*?[a-z])
// At least one digit, (?=.*?[0-9])
// At least one special character, (?=.*?[#?!@$%^&*-])
// Minimum eight in length .{8,} (with the anchors) ? max 16
const REGEX_TEST_PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;

const REGEX_ONLY_NUMBER = /^\d+$/;

const ThemeName = {
    Light: 'light',
    Dark: 'dark',
};

const LocalStorageKey = {
    DarkModeEnabled: 'dark-mode-enabled',
};

const WindowSize = {
    Xs: 0,
    Sm: 576,
    Md: 768,
    Lg: 992,
    Xl: 1200,
};

const ValidateType = {
    Required: 'required',
    Email: 'email',
    Password: 'password',
    Match: 'match'
};

const HUSTConstant = {
    ThemeName,
    LocalStorageKey,
    WindowSize,
    ValidateType,
    REGEX_TEST_EMAIL,
    REGEX_TEST_PASSWORD,
    REGEX_ONLY_NUMBER
};

export default HUSTConstant;

export { REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD, REGEX_ONLY_NUMBER, ThemeName, LocalStorageKey };
