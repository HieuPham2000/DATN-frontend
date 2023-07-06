import { memo, useState } from 'react';
import { ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { getConceptChildren, getConceptParents } from '~/services/treeService';
import { useQuery } from '@tanstack/react-query';
import GridConceptRelation from '~/components/TreePage/FullView/GridConceptRelation';

function ConceptFolderContent({ label, rootTreeData, listFile, onClickConcept }) {
    const [tmpSelectedConcept, setTmpSelectedConcept] = useState(null);

    const { data: listTmpParent } = useQuery({
        queryKey: ['getConceptParents', tmpSelectedConcept?.ConceptId],
        queryFn: async () => {
            const res = await getConceptParents(tmpSelectedConcept?.ConceptId);
            return res.data.Data;
        },
        enabled: !!tmpSelectedConcept?.ConceptId,
    });

    const { data: listTmpChildren } = useQuery({
        queryKey: ['getConceptChildren', tmpSelectedConcept?.ConceptId],
        queryFn: async () => {
            const res = await getConceptChildren(tmpSelectedConcept?.ConceptId);
            return res.data.Data;
        },
        enabled: !!tmpSelectedConcept?.ConceptId,
    });

    return (
        <>
            <Paper sx={{ ...stylePaper, p: 2, mt: 2 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        {label}
                        {': '}
                    </Typography>
                    {!listFile?.length ? ' No data' : ''}
                </Typography>
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                    {listFile?.map((x, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ px: 2 }}
                            onClick={() => setTmpSelectedConcept(x)}
                            selected={x.ConceptId === tmpSelectedConcept?.ConceptId}
                        >
                            <ListItemText>
                                {index + 1} - {x.Title}
                            </ListItemText>
                        </ListItemButton>
                    ))}
                </div>
            </Paper>
            {!!tmpSelectedConcept && (
                <GridConceptRelation
                    rootConcept={rootTreeData?.Concept}
                    tmpRootConcept={tmpSelectedConcept}
                    listChildren={listTmpChildren || []}
                    listParent={listTmpParent || []}
                    onClickConcept={onClickConcept}
                />
            )}
            {!tmpSelectedConcept && !!rootTreeData && (
                <GridConceptRelation
                    rootConcept={rootTreeData.Concept}
                    tmpRootConcept={rootTreeData.Concept}
                    listChildren={rootTreeData.ListChildren || []}
                    listParent={rootTreeData.ListParent || []}
                    onClickConcept={onClickConcept}
                />
            )}
        </>
    );
}

export default memo(ConceptFolderContent);
