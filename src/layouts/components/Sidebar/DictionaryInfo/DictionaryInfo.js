import { Button, Tooltip } from '@mui/material';
import styles from './DictionaryInfo.module.scss';
import classNames from 'classnames/bind';
import { ChangeCircle as ChangeDictionaryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function DictionaryInfo() {
    return (
        <div className={cx('wrapper')}>
            <Tooltip title="Current dictionary: My first PVO. Change?">
                <Button className={cx('wrapper-txt-dictionary')} component={Link} to="/dictionary">
                    <ChangeDictionaryIcon color="primary" className={cx('ic-change')} />
                    <div className={cx('dictionary-label')}>Current dictionary</div>
                    <div className={cx('dictionary-name')}>My first PVO</div>
                </Button>
            </Tooltip>
        </div>
    );
}

export default DictionaryInfo;
