import classNames from 'classnames/bind';
import styles from './BaseDialog.module.scss';
import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const cx = classNames.bind(styles);
function BaseDialog({ open, onClose, title, content, actions }) {
    return (
        <div className={cx('wrapper')}>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
                disableRestoreFocus
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
                    id="alert-dialog-description"
                    sx={{
                        // minWidth: 200,
                        // maxWidth: '100%',
                        // minHeight: 70,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}
                >
                    {content}
                </DialogContent>
                <DialogActions>{actions}</DialogActions>
            </Dialog>
        </div>
    );
}

export default memo(BaseDialog);
