import { North as ArrowUpIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import GridConceptRelation from '~/components/TreePage/SimpleView/GridConceptRelation';
import ListExample from '~/components/TreePage/SimpleView/ListExample';
import ListExampleRelation from '~/components/TreePage/SimpleView/ListExampleRelation';
import { getTree } from '~/services/treeService';

const ArrowUpBox = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 1,
            }}
        >
            <ArrowUpIcon color="primary" />
        </Box>
    );
};

function SimpleView({ rootConcept, setRootConcept }) {
    const [selectedExampleLinkId, setSelectedExampleLinkId] = useState(null);

    useEffect(() => {
        setSelectedExampleLinkId(null);
    }, [rootConcept]);

    const { data: treeData, isLoading } = useQuery({
        queryKey: ['getTree', rootConcept?.ConceptId],
        queryFn: async () => {
            const res = await getTree(rootConcept?.ConceptId);
            return res.data.Data;
        },
        enabled: !!rootConcept?.ConceptId,
    });

    const handleClickConcept = (concept) => {
        setRootConcept(concept);
    };

    if (!rootConcept || !treeData) {
        if (isLoading) {
            return <Loading />;
        }
        return <></>;
    }

    return (
        <>
            <ListExample
                rootConceptId={treeData?.Concept?.ConceptId}
                exampleLinkId={selectedExampleLinkId}
                setExampleLinkId={setSelectedExampleLinkId}
            />
            <ArrowUpBox />
            <ListExampleRelation
                listCountExampleLink={treeData?.ListCountExampleLink}
                selectedId={selectedExampleLinkId}
                setSelectedId={setSelectedExampleLinkId}
            />
            <ArrowUpBox />
            <GridConceptRelation
                rootConcept={treeData?.Concept}
                listChildren={treeData?.ListChildren || []}
                listParent={treeData?.ListParent || []}
                onClickConcept={handleClickConcept}
            />
        </>
    );
}

export default memo(SimpleView);
