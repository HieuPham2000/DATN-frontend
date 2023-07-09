const USER_SESSION = 'x-session-id';

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
    UserSession: USER_SESSION,
};

const WindowSize = {
    Xs: 0,
    Sm: 600,
    Md: 768,
    Lg: 992,
    Xl: 1200,
};

const ValidateType = {
    Required: 'required',
    Email: 'email',
    Password: 'password',
    Match: 'match',
};

const ToastMessage = {
    GeneralError: 'Something went wrong, please contact HUST PVO for help',
    Exception: 'Something went wrong, please contact HUST PVO for help',
    Timeout: 'Request timeout, please try again',
    Network: 'Please check your internet connection',
    ServerOff: 'The server is not responding, please try again later',
    TooManyRequestRangeTime: 'Please wait a few minutes before you try again',
};

const ErrorCode = {
    // Too many requests
    TooManyRequests: 429,

    //Incorrect email or password
    Err1000: 1000,

    //Email already in use
    Err1001: 1001,

    //Invalid account
    Err1002: 1002,

    //Invalid verification token
    Err1003: 1003,

    //Unactivated account
    Err1004: 1004,

    //Dictionary doesn't exist
    Err2000: 2000,

    //Dictionary name already in use
    Err2001: 2001,

    //Dictionary is in use
    Err2002: 2002,

    //Source dictionary is empty
    Err2003: 2003,

    //Concept already exists
    Err3001: 3001,

    //Concept can't be deleted
    Err3002: 3002,

    //A concept can't link to itself
    Err3003: 3003,

    //Circular link
    Err3004: 3004,

    //Concept doesn't exist
    Err3005: 3005,

    //Example doesn't exist
    Err4000: 4000,

    //Duplicate examples
    Err4001: 4001,

    //No highlighted parts
    Err4002: 4002,

    //Invalid parameters
    Err9000: 9000,

    //Invalid file upload
    Err9001: 9001,

    //This file is too large
    Err9002: 9002,

    //This file type is not supported
    Err9003: 9003,

    //Import session does not exist or has expired
    Err9004: 9004,

    //Data is stale
    Err9998: 9998,

    //General error
    Err9999: 9999,
};

const WaitTime = {
    SendActivateEmail: 120000, // 2 phút
};

const ValidateMessage = {
    Password:
        'Password must be from 8-16 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
};

const MaxFileSize = {
    Image: 3145728, // 3 * 1024 * 1024 byte = 3 MiB = 3.1 MB,
    Import: 5242880, // 5 * 1024 * 1024
};

const FileContentType = {
    Excel2007: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const ScreenInfo = {
    AccountSettingGeneralTab: 'Account Settings/General',
    AccountSettingSecurityTab: 'Account Settings/Security',
    AccountSettingSettingTab: 'Account Settings/Setting',
    AccessHistory: 'Access History',
    Dictionary: 'Dictionary',
    Concept: 'Concept',
    Example: 'Example',
    EditExample: 'Edit example',
};

const LogAction = {
    ChangePassword: {
        Type: 1,
        Text: 'Change password',
    },
    ChangeInfo: {
        Type: 2,
        Text: 'Change user information',
    },
    LoadDictionary: {
        Type: 3,
        Text: 'Load',
    },
    AddDictionary: {
        Type: 4,
        Text: 'Create',
    },
    EditDictionary: {
        Type: 5,
        Text: 'Edit',
    },
    DeleteDictionary: {
        Type: 6,
        Text: 'Delete',
    },
    DeleteDictionaryData: {
        Type: 7,
        Text: 'Delete data',
    },
    TransferDictionaryData: {
        Type: 8,
        Text: 'Transfer',
    },
    ExportData: {
        Type: 9,
        Text: 'Export',
    },
    ImportData: {
        Type: 10,
        Text: 'Import',
    },
    AddConcept: {
        Type: 11,
        Text: 'Add concept',
    },
    EditConcept: {
        Type: 12,
        Text: 'Edit concept',
    },
    DeleteConcept: {
        Type: 13,
        Text: 'Delete concept',
    },
    UpdateConceptRelationship: {
        Type: 13,
        Text: 'Update concept relation',
    },
    AddExample: {
        Type: 14,
        Text: 'Add example',
    },
    EditExample: {
        Type: 15,
        Text: 'Edit example',
    },
    DeleteExample: {
        Type: 16,
        Text: 'Delete example',
    },
    ChangeSetting: {
        Type: 17,
        Text: 'Change setting',
    },
};

const SortListDictionary = {
    DescLastView: 'LastView',
    AscName: 'Name',
};

const UserSettingKey = {
    IsSearchSoundex: 'IS_SEARCH_SOUNDEX',
};

const SourceApiDictionary = {
    FreeDictionaryApi: 'FreeDictionaryApi',
    WordsApi: 'WordsApi',
    WordNet: 'WordNet',
};

const HUSTConstant = {
    USER_SESSION,
    REGEX_TEST_EMAIL,
    REGEX_TEST_PASSWORD,
    REGEX_ONLY_NUMBER,
    ThemeName,
    LocalStorageKey,
    WindowSize,
    ValidateType,
    ValidateMessage,
    ToastMessage,
    ErrorCode,
    WaitTime,
    MaxFileSize,
    FileContentType,
    ScreenInfo,
    LogAction,
    SortListDictionary,
    UserSettingKey,
    SourceApiDictionary,
};

export default HUSTConstant;

export { REGEX_TEST_EMAIL, REGEX_TEST_PASSWORD, REGEX_ONLY_NUMBER, ThemeName, LocalStorageKey, USER_SESSION };
