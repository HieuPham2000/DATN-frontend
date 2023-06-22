// import classNames from 'classnames/bind';
// import styles from './AlertSaveChangeDialog.module.scss';
import { Button } from '@mui/material';
import AlertDialog from '~/components/AlertDialog';

// const cx = classNames.bind(styles);
export default function AlertSaveChangeDialog({ open, onClose, onSave, onNo }) {
    return (
        <AlertDialog content="Save changes?" open={open} onClose={onClose}>
            <Button color="minor" size="large" onClick={onNo}>
                No
            </Button>
            <Button autoFocus size="large" onClick={onSave}>
                Save
            </Button>
        </AlertDialog>
    );
}
