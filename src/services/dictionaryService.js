import http from '~/utils/httpRequest';

export const getNumberRecord = (dictionaryId) => {
    return http.get('dictionary/get_number_record', { params: { dictionaryId } });
};
