import { memo, useMemo } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { formatPercent } from '~/utils/common/utils';
import PronunciationBox from '~/components/Helper/LookupTab/ViewResultWordsApi/PronunciationBox';
import DefinitionBox from '~/components/Helper/LookupTab/ViewResultWordsApi/DefinitionBox/DefinitionBox';

function ViewResultWordsApi({ result }) {
    const meanings = useMemo(() => result?.results || [], [result]);
    const pronunciation = useMemo(() => result?.pronunciation, [result]);
    const frequency = useMemo(() => result?.frequency || 0, [result]);
    const percentFrequency = useMemo(() => (frequency * 100) / 7 || 0, [frequency]);
    if (!result) {
        return <></>;
    }

    return (
        <>
            <Box>
                <Typography color="primary" fontWeight="500" component="span">
                    Word:{' '}
                </Typography>
                <Typography component="span">{result.word}</Typography>
            </Box>
            <Box>
                <Typography color="primary" fontWeight="500" component="span">
                    Frequency{': '}
                </Typography>
                <Typography component="span">{formatPercent(percentFrequency)}</Typography>
                <LinearProgress variant="determinate" value={percentFrequency} />
            </Box>

            <PronunciationBox pronunciation={pronunciation || {}} />
            <DefinitionBox meanings={meanings} />
        </>
    );
}

export default memo(ViewResultWordsApi);
