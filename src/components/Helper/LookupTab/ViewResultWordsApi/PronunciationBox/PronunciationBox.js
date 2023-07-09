import { memo } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import _ from 'lodash';

function PronunciationBox({ pronunciation }) {
    if (!pronunciation || typeof pronunciation !== 'object' || _.isEmpty(pronunciation)) {
        return <></>;
    }
    return (
        <Box sx={{ mt: 1 }}>
            <Typography color="primary" fontWeight="500">
                Pronunciation:
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}
            >
                {Object.keys(pronunciation).map((key) => (
                    <Box
                        key={key}
                        sx={{
                            py: 0.5,
                            px: 1,
                            borderRadius: '4px',
                            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
                        }}
                    >
                        <Typography component="span" color="success.main">{`${key}: `}</Typography>
                        <Typography component="span">{`/${pronunciation[key]}/`}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default memo(PronunciationBox);
