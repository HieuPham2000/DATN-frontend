import { memo } from 'react';
import { Box, ListItemButton, Paper, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';

function ListExampleRelation({ listCountExampleLink, selectedId, setSelectedId }) {
    const handleClickRelationType = (exampleLinkId) => {
        setSelectedId(exampleLinkId);
    };

    return (
        <Paper sx={{ ...stylePaper, p: 2, width: '100%', overflow: 'auto' }}>
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
                {listCountExampleLink?.map((x, i) => (
                    <ListItemButton
                        sx={{
                            flexDirection: 'column',
                            flexShrink: 0,
                            px: 2,
                        }}
                        key={i}
                        onClick={() => handleClickRelationType(x.ExampleLinkId)}
                        selected={x.ExampleLinkId === selectedId}
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
    );
}

export default memo(ListExampleRelation);
