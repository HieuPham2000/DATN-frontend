import { memo, useState } from 'react';
import { IconButton, ListItemButton, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import EditExampleDialog from '~/components/Example/EditExampleDialog/EditExampleDialog';
import Markdown from '~/components/BaseComponent/Markdown/Markdown';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLinkedExampleByRelationshipType } from '~/services/treeService';
import { getDisplayExample, stripHtmlExceptHighlight } from '~/utils/common/utils';
import { Edit } from '@mui/icons-material';

function ListExample({ rootConceptId, exampleLinkId, setExampleLinkId }) {
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExampleId, setSelectedExampleId] = useState(null);

    const { data: listExample } = useQuery({
        queryKey: ['getLinkedExampleByRelationshipType', rootConceptId, exampleLinkId],
        queryFn: async () => {
            const res = await getLinkedExampleByRelationshipType(rootConceptId, exampleLinkId);
            return res.data.Data;
        },
        enabled: !!rootConceptId && !!exampleLinkId,
    });

    const handleClickExample = (exampleId) => {
        setSelectedExampleId(exampleId);
    };

    const handleDbClickExample = (exampleId) => {
        setSelectedExampleId(exampleId);
        setOpenDialog(true);
    };

    const handleAfterModifyExample = () => {
        queryClient.invalidateQueries(['example', selectedExampleId]);
        queryClient.invalidateQueries(['getTree', rootConceptId]);
        queryClient.invalidateQueries(['getLinkedExampleByRelationshipType', rootConceptId, exampleLinkId]);
        setSelectedExampleId(null);
        setExampleLinkId(null);
    };

    return (
        <>
            {openDialog && (
                <EditExampleDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    exampleId={selectedExampleId}
                    handleAfter={handleAfterModifyExample}
                />
            )}
            <Paper sx={{ ...stylePaper, p: 2, mt: 2 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        List examples:
                    </Typography>
                    {!listExample || listExample.length === 0 ? ' No data' : ''}
                </Typography>
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                    {listExample?.map((x, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ px: 2 }}
                            onClick={() => handleClickExample(x.ExampleId)}
                            onDoubleClick={() => handleDbClickExample(x.ExampleId)}
                            selected={x.ExampleId === selectedExampleId}
                        >
                            <ListItemText>
                                <Markdown
                                    children={`${index + 1} - ${getDisplayExample(
                                        stripHtmlExceptHighlight(x.ExampleHtml),
                                    )}`}
                                />
                            </ListItemText>
                            <Tooltip title="View/Edit/Delete">
                                <IconButton onClick={() => handleDbClickExample(x.ExampleId)}>
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ListItemButton>
                    ))}
                </div>
            </Paper>
        </>
    );
}

export default memo(ListExample);
