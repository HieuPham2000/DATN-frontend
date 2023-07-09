import { memo, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import MySnackbar from '~/components/BaseComponent/MySnackbar';

function SynonymAntonymBox({ listData, label, sx }) {
    const [openSnack, setOpenSnack] = useState(false);

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setOpenSnack(true);
    };

    if (!listData || !Array.isArray(listData) || listData.length === 0) {
        return <></>;
    }

    return (
        <Box sx={{ ...sx }}>
            <MySnackbar open={openSnack} setOpen={setOpenSnack} />
            <Typography color="info.main" component="span" sx={{ mr: 1 }}>
                {label}
                {': '}
            </Typography>
            {listData.map((x) => (
                <Chip label={x} key={x} sx={{ mr: 0.5, mt: 0.5 }} variant="outlined" onClick={handleCopyToClipboard} />
            ))}
        </Box>
    );
}

export default memo(SynonymAntonymBox);
