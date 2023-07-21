import { memo } from 'react';
import { Box, Grid, ListItemButton, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import { stylePaper, textEllipsisText } from '~/utils/style/muiCustomStyle';
import { East as ArrowRightIcon } from '@mui/icons-material';

function GridConceptRelation({ rootConcept, listChildren, listParent, onClickConcept }) {
    const handleClickConcept = (concept) => {
        onClickConcept(concept);
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={4} order={{ md: 2, sm: 1, xs: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        my: 1,
                    }}
                >
                    <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }}>
                        <ArrowRightIcon color="primary" />
                    </Box>
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
                        <Tooltip title={rootConcept?.Title}>
                            <Typography variant="h6" sx={textEllipsisText}>
                                {rootConcept?.Title}
                            </Typography>
                        </Tooltip>
                    </Paper>
                    <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' } }}>
                        <ArrowRightIcon color="primary" />
                    </Box>
                </Box>
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
                        {listChildren?.map((x) => (
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
                    <Typography color="primary" fontWeight="500" pl={1}>
                        Parent
                    </Typography>
                    <Box>
                        {listParent?.map((x) => (
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
    );
}

export default memo(GridConceptRelation);
