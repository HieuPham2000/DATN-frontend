import http from '~/utils/httpRequest';

export const getTree = (conceptId) => {
    return http.get('tree/get_tree', { params: { conceptId } });
};

export const getConceptParents = (conceptId) => {
    return http.get('tree/get_concept_parents', { params: { conceptId } });
};

export const getConceptChildren = (conceptId) => {
    return http.get('tree/get_concept_children', { params: { conceptId } });
};

export const getLinkedExampleByRelationshipType = (conceptId, exampleLinkId) => {
    return http.get('tree/get_linked_example_by_relationship_type', { params: { conceptId, exampleLinkId } });
};

