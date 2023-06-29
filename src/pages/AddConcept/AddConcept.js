import { Helmet } from 'react-helmet-async';
import styles from './AddConcept.module.scss';
import classNames from 'classnames/bind';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import AddConceptDialog from '~/components/Concept/AddConceptDialog';
import { useQueryClient } from '@tanstack/react-query';

const cx = classNames.bind(styles);

function AddConcept() {
    const queryClient = useQueryClient();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const handleAdd = () => {
        setOpenAddDialog(true);
    };

    const handleAfterAddSuccess = () => {
        queryClient.invalidateQueries(['searchConcept']);
    };
    return (
        <div className={cx('wrapper')}>
            {openAddDialog && (
                <AddConceptDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    handleAfter={handleAfterAddSuccess}
                />
            )}
            <Helmet>
                <title>Concept | HUST PVO</title>
            </Helmet>
            <div className={cx('toolbar-wrapper')}>
                <Typography variant="h4">Concepts</Typography>
                <Button sx={{ display: 'inline-block', minWidth: 100 }} variant="contained" onClick={handleAdd}>
                    Add
                </Button>
            </div>
            <div>
                
            </div>
        </div>
    );
}

export default AddConcept;
