import { memo } from 'react';
import { Snackbar } from '@mui/material';

function MySnackbar({ open, setOpen, message = 'Copied to clipboard!' }) {
    const handleCloseSnack = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleCloseSnack}
            message={message}
            autoHideDuration={1000}
        />
    );
}

export default memo(MySnackbar);
