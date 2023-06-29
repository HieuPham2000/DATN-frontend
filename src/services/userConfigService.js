import http from '~/utils/httpRequest';

export const getListConceptLink = () => {
    return http.get('userConfig/get_list_concept_link');
};

export const getListExampleLink = () => {
    return http.get('userConfig/get_list_example_link');
};

export const getListExampleAttribute = () => {
    return http.get('userConfig/get_list_example_attribute');
};
