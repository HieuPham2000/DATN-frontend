import http from '~/utils/httpRequest';

export const addExample = ({
    DetailHtml,
    ToneId,
    ModeId,
    RegisterId,
    NuanceId,
    DialectId,
    Note,
    ListExampleRelationship,
}) => {
    return http.post('example/add_example', {
        DetailHtml: DetailHtml?.trim(),
        ToneId,
        ModeId,
        RegisterId,
        NuanceId,
        DialectId,
        Note,
        ListExampleRelationship,
    });
};

export const searchExample = ({
    Keyword,
    ToneId,
    ModeId,
    RegisterId,
    NuanceId,
    DialectId,
    ListLinkedConceptId,
    IsSearchUndecided,
    IsFulltextSearch,
}) => {
    return http.post('example/search_example', {
        Keyword: Keyword?.trim(),
        ToneId,
        ModeId,
        RegisterId,
        NuanceId,
        DialectId,
        ListLinkedConceptId,
        IsSearchUndecided,
        IsFulltextSearch,
    });
};
