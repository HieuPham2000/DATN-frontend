import { Helmet } from 'react-helmet-async';
import styles from './AddConcept.module.scss';
import classNames from 'classnames/bind';
import { Typography } from '@mui/material';

const cx = classNames.bind(styles);

function AddConcept() {
    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Concept | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Concepts</Typography>
        </div>
    );
}

export default AddConcept;
