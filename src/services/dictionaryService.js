import http from '~/utils/httpRequest';

export const getNumberRecord = (dictionaryId) => {
    return http.get('dictionary/get_number_record', { params: { dictionaryId } });
};

export const getDictionaryById = (dictionaryId) => {
    return http.get('dictionary/get_dictionary_by_id', { params: { dictionaryId } });
};

export const getListDictionary = () => {
    return http.get('dictionary/get_list_dictionary');
};

export const loadDictionary = (dictionaryId) => {
    return http.get('dictionary/load_dictionary', { params: { dictionaryId } });
};

export const addDictionary = (dictionaryName, cloneDictionaryId) => {
    return http.post('dictionary/add_dictionary', {
        DictionaryName: dictionaryName?.trim(),
        CloneDictionaryId: cloneDictionaryId,
    });
};

export const updateDictionary = (dictionaryId, dictionaryName) => {
    return http.patch('dictionary/update_dictionary', {
        DictionaryId: dictionaryId,
        DictionaryName: dictionaryName?.trim(),
    });
};
