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
