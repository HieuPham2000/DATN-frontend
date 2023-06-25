import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function AlertDialog({ open, onClose, title, content, children: buttons }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xs"
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent
                sx={{
                    minHeight: 70,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
            >
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>{buttons}</DialogActions>
        </Dialog>
    );
}
