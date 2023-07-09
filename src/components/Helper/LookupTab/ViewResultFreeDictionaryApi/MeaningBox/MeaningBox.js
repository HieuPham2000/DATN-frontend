import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import DefinitionBox from '~/components/Helper/LookupTab/ViewResultFreeDictionaryApi/DefinitionBox';

function MeaningBox({ meanings }) {
    if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
        return <></>;
    }
    return (
        <Box>
            <Typography color="primary" fontWeight="500">
                Meanings:
            </Typography>
            {meanings.map((m, mIndex) => (
                <Box key={mIndex} sx={{ mt: 1 }}>
                    <Typography color="success.main" fontWeight="500">
                        {`${mIndex + 1} - Meaning ${mIndex + 1}:`}
                    </Typography>
                    <Typography color="success.main">Part of Speech: {m.partOfSpeech}</Typography>
                    {m.definitions?.map((d, dIndex) => (
                        <DefinitionBox data={d} key={dIndex} />
                    ))}
                </Box>
            ))}
        </Box>
    );
}

export default memo(MeaningBox);
