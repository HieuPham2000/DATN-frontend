import { memo, useState } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import MySnackbar from '~/components/BaseComponent/MySnackbar';
import SynonymAntonymBox from '~/components/Helper/LookupTab/ViewResultFreeDictionaryApi/SynonymAntonymBox';

const styleBox = {
    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
    py: 0.5,
    px: 1,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
    },
};
function DefinitionBox({ data }) {
    const [openSnack, setOpenSnack] = useState(false);

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setOpenSnack(true);
    };

    if (!data || typeof data !== 'object') {
        return <></>;
    }

    return (
        <Box
            sx={{
                p: 1,
                my: 2,
                mx: 0,
                border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.5)}`,
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.08),
                borderRadius: '4px',
            }}
        >
            <MySnackbar open={openSnack} setOpen={setOpenSnack} />
            <Box onClick={() => handleCopyToClipboard(data.definition)}>
                <Typography color="info.main">Definition{': '}</Typography>
                <Typography sx={styleBox}>{data.definition}</Typography>
            </Box>
            {!!data.example && typeof data.example === 'string' && (
                <Box sx={{ mt: 1 }} onClick={() => handleCopyToClipboard(data.definition)}>
                    <Typography color="info.main">Example{': '}</Typography>
                    <Typography sx={styleBox}>{data.example}</Typography>
                </Box>
            )}
            <SynonymAntonymBox
                listData={data.synonyms}
                label="Synonyms"
                sx={{
                    mt: 1,
                }}
            />
            <SynonymAntonymBox
                listData={data.antonyms}
                label="Antonyms"
                sx={{
                    mt: 1,
                }}
            />
        </Box>
    );
}

export default memo(DefinitionBox);
