import { Button, Tooltip } from '@mui/material';
import styles from './DictionaryInfo.module.scss';
import classNames from 'classnames/bind';
import { ChangeCircle as ChangeDictionaryIcon, Book as DictionaryIcon } from '@mui/icons-material';
const cx = classNames.bind(styles);

function DictionaryInfo({ onlyShowIcon }) {
    return (
        <div className={cx('wrapper', { 'small-mode': onlyShowIcon })}>
            <Tooltip title="View all concepts in this dictionary">
                <Button className={cx('wrapper-item', 'wrapper-btn-dictionary')}>
                    <DictionaryIcon color="primary" className={cx('ic-dictionary')} />
                </Button>
            </Tooltip>
            <Tooltip title="Current dictionary: My first PVO. Change?">
                <Button className={cx('wrapper-item', 'wrapper-txt-dictionary')}>
                    <div className={cx('dictionary-name')}>My first PVO</div>
                    <div style={{ flex: 1 }}></div>
                    <ChangeDictionaryIcon color="primary" className={cx('ic-change')} />
                </Button>
            </Tooltip>
        </div>
    );
}

export default DictionaryInfo;
