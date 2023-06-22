import classNames from 'classnames/bind';
import styles from './AlertDialog.module.scss';
import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const cx = classNames.bind(styles);
export default function AlertDialog({ open, onClose, title, content, children: buttons }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
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
                    width: 360,
                    maxWidth: '80%',
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
