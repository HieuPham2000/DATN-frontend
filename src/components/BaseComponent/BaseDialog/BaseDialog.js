import classNames from 'classnames/bind';
import styles from './BaseDialog.module.scss';
import { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);
function BaseDialog({ open, onClose, title, content, actions, isLoading, isFullScreen }) {
    return (
        <div className={cx('wrapper')}>
            <Dialog
                open={open}
                // onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
                disableRestoreFocus
                fullScreen={isFullScreen}
            >
                {isLoading && <Loading />}
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
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mr: 2,
                    }}
                >
                    {title}
                </DialogTitle>
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
