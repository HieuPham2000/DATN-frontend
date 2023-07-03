import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { memo } from 'react';
import EditExampleDialogContent from '~/components/Example/EditExampleDialog/EditExampleDialogContent';

function EditExampleDialog({ open, onClose, exampleId, handleAfter = () => {} }) {
    const Content = (
        <>
            <EditExampleDialogContent onClose={onClose} exampleId={exampleId} handleAfter={handleAfter} />
        </>
    );

    const Action = <></>;
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
                disableRestoreFocus
                fullScreen
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 4,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mr: 2,
                        py: 1,
                        borderBottom: '1px dashed rgba(145, 158, 171, 0.24)',
                    }}
                >
                    Edit example
                </DialogTitle>
                <DialogContent
                    id="alert-dialog-description"
                    sx={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        pb: 0,
                    }}
                >
                    {Content}
                </DialogContent>
                <DialogActions sx={{ p: 0 }}>{Action}</DialogActions>
            </Dialog>
        </>
    );
}

export default memo(EditExampleDialog);
