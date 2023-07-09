import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import DefinitionItem from '~/components/Helper/LookupTab/ViewResultWordsApi/DefinitionItem';

function DefinitionBox({ meanings }) {
    if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
        return <></>;
    }
    return (
        <Box sx={{ mt: 1 }}>
            <Typography color="primary" fontWeight="500">
                Meanings:
            </Typography>
            {meanings.map((item, index) => (
                <DefinitionItem key={index} data={item} />
            ))}
        </Box>
    );
}

export default memo(DefinitionBox);
