import { memo, useCallback, useMemo } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import HelperDialogContent from '~/components/Helper/HelperDialogContent';

function HelperDialog({ open, onClose }) {
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const Content = useMemo(() => <HelperDialogContent />, []);
    const Action = useMemo(
        () => (
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', pl: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleClose}>Close</Button>
            </Box>
        ),
        [handleClose],
    );
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="lg"
                disableRestoreFocus
                PaperProps={{
                    sx: {
                        minHeight: '90vh',
                    },
                }}
                keepMounted
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mr: 2,
                        pb: 0,
                    }}
                >
                    Utility
                </DialogTitle>
                <DialogContent
                    id="alert-dialog-description"
                    sx={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        pb: 0,
                    }}
                >
                    {Content}
                </DialogContent>
                <DialogActions>{Action}</DialogActions>
            </Dialog>
        </>
    );
}

export default memo(HelperDialog);
