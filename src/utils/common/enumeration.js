const Enum = {
    ServiceResultStatus: {
        Success: 1,
        Fail: 2,
        Exception: -1,
    },
    UserStatus: {
        Active: 1,
        NotActivated: 2,
        Blocked: 3,
    },
    ConceptLinkType: {
        NoLink: 1,
        Association: 2,
        TypeOf: 3,
    },
    ExampleLinkType: {
        NoLink: 1,
        Idiom: 2,
        Nominal: 3,
        Agent: 4,
        Patient: 5,
        Action: 6,
        DescribedBy: 7,
        Describing: 8,
        OtherPhrase: 9,
    },
    ToneType: {
        Neutral: 1,
        Informal: 2,
        Formal: 3,
        SlightlyInformal: 4,
        SlightlyFormal: 5,
    },
    ModeType: {
        Neutral: 1,
        Spoken: 2,
        Written: 3,
    },
    RegisterType: {
        Neutral: 1,
        Academic: 2,
        Literature: 3,
        Business: 4,
        Law: 5,
        Journalism: 6,
        Medicine: 7,
        IT: 8,
        Other: 9,
    },
    NuanceType: {
        Neutral: 1,
        OldFashioned: 2,
        Humorous: 3,
        OftPositive: 4,
        OftNegative: 5,
    },
    DialectType: {
        Neutral: 1,
        American: 2,
        British: 3,
        Other: 4,
    },
    TreeFolderType: {
        Root: 999,
        Parent: 1,
        Children: 2,
        Example: 3,
    },
};

export { Enum };
