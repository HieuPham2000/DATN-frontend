import { memo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import _ from 'lodash';

function PronunciationBox({ pronunciation }) {
    const handlePlayAudio = (url) => {
        if (url) {
            new Audio(url).play();
        }
    };

    if (!pronunciation || typeof pronunciation !== 'object' || _.isEmpty(pronunciation)) {
        return <></>;
    }
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            <Typography color="primary" fontWeight="500">
                Pronunciation:
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                {Object.keys(pronunciation)
                    .filter((key) => pronunciation[key])
                    .map((key) => (
                        <Box key={key}>
                            <IconButton onClick={() => handlePlayAudio(pronunciation[key])}>
                                <Typography>{key}</Typography>
                                <VolumeUp></VolumeUp>
                            </IconButton>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
}

export default memo(PronunciationBox);
