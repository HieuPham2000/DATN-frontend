import { Info } from '@mui/icons-material';
import { Box, Grid, ListItemButton, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import Markdown from '~/components/BaseComponent/Markdown/Markdown';
import EditExampleDialog from '~/components/Example/EditExampleDialog/EditExampleDialog';
import { getDisplayExample, stripHtmlExceptHighlight } from '~/utils/common/utils';
import { stylePaper, textEllipsisText } from '~/utils/style/muiCustomStyle';

function SimpleView({ treeData, listExample, onClickConcept, onClickRelationType }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExampleId, setSelectedExampleId] = useState(null);
    const [selectedExampleLinkId, setSelectedExampleLinkId] = useState(null);

    const handleClickExample = (exampleId) => {
        setSelectedExampleId(exampleId);
    };

    const handleDbClickExample = (exampleId) => {
        setSelectedExampleId(exampleId);
        setOpenDialog(true);
    };

    const handleAfterModifyExample = () => {
        onClickRelationType(selectedExampleLinkId);
    };

    const handleClickConcept = (concept) => {
        onClickConcept(concept);
    };

    const handleClickRelationType = (exampleLinkId) => {
        setSelectedExampleLinkId(exampleLinkId);
        onClickRelationType(exampleLinkId);
    };

    useEffect(() => {
        setSelectedExampleId(null);
        setSelectedExampleLinkId(null);
    }, [treeData]);

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
                    {listExample.length === 0 ? ' No data' : ''}
                </Typography>
                {listExample?.length > 0 && (
                    <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'flex-start' }}
                        >
                            <Info fontSize="small" color="text.secondary" sx={{ mr: 0.2, pb: 0.2 }} />
                            Double-click to view/edit/delete example
                        </Typography>
                    </div>
                )}
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                    {listExample?.map((x, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ px: 2 }}
                            onClick={() => handleClickExample(x.ExampleId)}
                            onDoubleClick={() => handleDbClickExample(x.ExampleId)}
                            selected={x.ExampleId === selectedExampleId}
                        >
                            <Typography component="div">
                                <Markdown
                                    children={`${index + 1} - ${getDisplayExample(
                                        stripHtmlExceptHighlight(x.ExampleHtml),
                                    )}`}
                                />
                            </Typography>
                        </ListItemButton>
                    ))}
                </div>
            </Paper>
            <Paper sx={{ ...stylePaper, p: 2, mt: 2, width: '100%', overflow: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        // justifyContent: 'center',
                        gap: '24px',

                        '&:before, &:after': {
                            content: '""',
                            margin: 'auto',
                        },
                    }}
                >
                    {treeData.ListCountExampleLink?.map((x, i) => (
                        <ListItemButton
                            sx={{
                                flexDirection: 'column',
                                flexShrink: 0,
                                px: 2,
                            }}
                            key={i}
                            onClick={() => handleClickRelationType(x.ExampleLinkId)}
                            selected={x.ExampleLinkId === selectedExampleLinkId}
                            disabled={x.Count === 0}
                        >
                            <Typography color="primary" sx={{ whiteSpace: 'nowrap' }}>
                                {x.ExampleLinkName}
                            </Typography>
                            <Typography color="primary" variant="h6">
                                {x.Count}
                            </Typography>
                        </ListItemButton>
                    ))}
                </Box>
            </Paper>
            <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={12} md={4} order={{ md: 2, sm: 1, xs: 1 }}>
                    <Paper
                        sx={{
                            ...stylePaper,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 200,
                            height: 50,
                            p: 2,
                            m: '0 auto',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            overflow: 'hidden',
                            borderRadius: '40px',
                        }}
                        id="paper1"
                    >
                        <Tooltip title={treeData.Concept?.Title}>
                            <Typography variant="h6" sx={textEllipsisText}>
                                {treeData.Concept?.Title}
                            </Typography>
                        </Tooltip>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} order={{ md: 1, sm: 1, xs: 2 }}>
                    <Paper
                        sx={{
                            ...stylePaper,
                            width: 280,
                            maxHeight: 300,
                            p: 2,
                            m: '0 auto',
                        }}
                        id="paper2"
                    >
                        <Typography color="primary" fontWeight="500" pl={1}>
                            Children
                        </Typography>
                        <Box>
                            {treeData.ListChildren?.map((x) => (
                                <Tooltip title={`${x.Title} (${x.ConceptLinkName})`} key={x.ConceptId}>
                                    <ListItemButton sx={{ px: 1, py: 0.5 }} onClick={() => handleClickConcept(x)}>
                                        <ListItemText
                                            sx={{ maxWidth: '50%' }}
                                            primaryTypographyProps={{ style: textEllipsisText }}
                                        >
                                            {x.Title}
                                        </ListItemText>
                                        <ListItemText
                                            sx={{ textAlign: 'right', maxWidth: '50%' }}
                                            primaryTypographyProps={{ style: textEllipsisText }}
                                        >
                                            {x.ConceptLinkName}
                                        </ListItemText>
                                    </ListItemButton>
                                </Tooltip>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} order={{ md: 3, sm: 3, xs: 3 }}>
                    <Paper
                        sx={{
                            ...stylePaper,
                            width: 280,
                            maxHeight: 300,
                            p: 2,
                            m: '0 auto',
                        }}
                    >
                        <Typography color="primary" fontWeight="500">
                            Parent
                        </Typography>
                        <Box>
                            {treeData.ListParent?.map((x) => (
                                <Tooltip title={`${x.Title} (${x.ConceptLinkName})`} key={x.ConceptId}>
                                    <ListItemButton sx={{ px: 1, py: 0.5 }} onClick={() => handleClickConcept(x)}>
                                        <ListItemText
                                            sx={{ maxWidth: '50%' }}
                                            primaryTypographyProps={{ style: textEllipsisText }}
                                        >
                                            {x.ConceptLinkName}
                                        </ListItemText>
                                        <ListItemText
                                            sx={{ textAlign: 'right', maxWidth: '50%' }}
                                            primaryTypographyProps={{ style: textEllipsisText }}
                                        >
                                            {x.Title}
                                        </ListItemText>
                                    </ListItemButton>
                                </Tooltip>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default memo(SimpleView);
