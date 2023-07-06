import http from '~/utils/httpRequest';

export const getListMostRecentConcept = (limit) => {
    return http.get('dashboard/get_list_most_recent_concept', { params: { limit } });
};

export const getListMostRecentExample = (limit) => {
    return http.get('dashboard/get_list_most_recent_example', { params: { limit } });
};
