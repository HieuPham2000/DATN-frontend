import http from '~/utils/httpRequest';

export const getListConcept = (dictionaryId) => {
    return http.get('concept/get_list_concept', { params: { dictionaryId } });
};

export const addConcept = (title, description) => {
    return http.post('concept/add_concept', { Title: title?.trim(), Description: description?.trim() });
};

export const updateConcept = (conceptId, title, description) => {
    return http.put('concept/update_concept', {
        ConceptId: conceptId,
        Title: title?.trim(),
        Description: description?.trim(),
    });
};

export const deleteConcept = (conceptId, isForced) => {
    return http.delete('concept/delete_concept', {
        params: {
            conceptId,
            isForced,
        },
    });
};

export const getConcept = (conceptId) => {
    return http.get('concept/get_concept', { params: { conceptId } });
};

export const searchConcept = ({ searchKey, dictionaryId, isSearchSoundex }) => {
    return http.get('concept/search_concept', {
        params: { searchKey: searchKey?.trim(), dictionaryId, isSearchSoundex },
    });
};

export const getConceptRelationship = (conceptId, parentId) => {
    return http.get('concept/get_concept_relationship', { params: { conceptId, parentId } });
};

export const updateConceptRelationship = (conceptId, parentId, conceptLinkId, isForced) => {
    return http.put('concept/update_concept_relationship', {
        ConceptId: conceptId,
        ParentId: parentId,
        ConceptLinkId: conceptLinkId,
        IsForced: isForced,
    });
};

export const getListRecommendConcept = (keywords, dictionaryId) => {
    let obj = {};
    keywords.forEach((x, index) => {
        obj[`keywords[${index}]`] = x;
    });
    return http.get('concept/get_list_recommend_concept', {
        params: {
            ...obj,
            dictionaryId,
        },
    });
};
