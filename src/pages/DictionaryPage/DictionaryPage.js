import { Typography } from '@mui/material';
import styles from './DictionaryPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DictionaryPage() {
    return (
        <div className={cx('wrapper')}>
            <Typography variant="h4">My Dictionaries</Typography>
        </div>
    );
}

export default DictionaryPage;
