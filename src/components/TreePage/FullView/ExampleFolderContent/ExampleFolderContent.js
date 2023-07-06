import { memo, useEffect, useState } from 'react';
import { IconButton, ListItemButton, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import Markdown from '~/components/BaseComponent/Markdown/Markdown';
import { getDisplayExample, stripHtmlExceptHighlight } from '~/utils/common/utils';
import { Edit } from '@mui/icons-material';
import ExampleShortView from '~/components/Example/ExampleShortView';
import EditExampleDialog from '~/components/Example/EditExampleDialog';
import { getLinkedExampleByRelationshipType } from '~/services/treeService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function ExampleFolderContent({ rootConceptId, exampleLinkId, setSelectedNode }) {
    const queryClient = useQueryClient();
    const [selectedExampleId, setSelectedExampleId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

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
        setSelectedNode(null);
    };

    const { data: listExample } = useQuery({
        queryKey: ['getLinkedExampleByRelationshipType', rootConceptId, exampleLinkId],
        queryFn: async () => {
            const res = await getLinkedExampleByRelationshipType(rootConceptId, exampleLinkId);
            return res.data.Data;
        },
        enabled: !!rootConceptId && !!exampleLinkId,
    });

    useEffect(() => {
        setSelectedExampleId(null);
    }, [exampleLinkId]);

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
                        Examples
                        {': '}
                    </Typography>
                    {!listExample?.length ? ' No data' : ''}
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
            <Paper sx={{ ...stylePaper, p: 2, mt: 1 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Selected example:
                    </Typography>
                    {!selectedExampleId ? ' No data' : ''}
                    {!!selectedExampleId && (
                        <Tooltip title="Edit/Delete">
                            <IconButton onClick={() => handleDbClickExample(selectedExampleId)} sx={{ mb: 1 }}>
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Typography>
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    <ExampleShortView exampleId={selectedExampleId} />
                </div>
            </Paper>
        </>
    );
}

export default memo(ExampleFolderContent);
