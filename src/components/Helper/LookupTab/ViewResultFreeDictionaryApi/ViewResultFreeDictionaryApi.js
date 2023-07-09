import { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import PronunciationBox from '~/components/Helper/LookupTab/ViewResultFreeDictionaryApi/PronunciationBox';
import MeaningBox from '~/components/Helper/LookupTab/ViewResultFreeDictionaryApi/MeaningBox';

function ViewResultFreeDictionaryApi({ result }) {
    const pronunciation = useMemo(() => result?.pronunciation, [result]);
    const content = useMemo(() => (result?.content || [])[0], [result]);
    const meanings = useMemo(() => content?.meanings || [], [content]);

    if (!result || !pronunciation || !content) {
        return <></>;
    }

    return (
        <>
            <Box>
                <Typography color="primary" fontWeight="500" component="span">
                    Word:{' '}
                </Typography>
                <Typography component="span">{content.word}</Typography>
            </Box>
            <PronunciationBox pronunciation={pronunciation || {}} />
            <MeaningBox meanings={meanings} />
        </>
    );
}

export default memo(ViewResultFreeDictionaryApi);
