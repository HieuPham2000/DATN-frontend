import { Button, Tooltip } from '@mui/material';
import styles from './DictionaryInfo.module.scss';
import classNames from 'classnames/bind';
import { ChangeCircle as ChangeDictionaryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import { useMemo } from 'react';
const cx = classNames.bind(styles);

function DictionaryInfo({ small }) {
    const { data: accountInfo } = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? '', [accountInfo]);
    return (
        <div className={cx('wrapper', { 'small-mode': small })}>
            {/* <Tooltip title="View all concepts in this dictionary">
                <Button className={cx('wrapper-item', 'wrapper-btn-dictionary')}>
                    <DictionaryIcon color="primary" className={cx('ic-dictionary')} />
                </Button>
            </Tooltip> */}
            {!small && (
                <Tooltip title={`Current dictionary: ${dictionaryName}. Change?`}>
                    <Button
                        className={cx('wrapper-item', 'wrapper-txt-dictionary')}
                        component={Link}
                        to="/dictionary"
                        color="inherit"
                    >
                        <div className={cx('dictionary-name')}>{dictionaryName}</div>
                        <div style={{ flex: 1 }}></div>
                        <ChangeDictionaryIcon color="primary" className={cx('ic-change')} />
                    </Button>
                </Tooltip>
            )}
        </div>
    );
}

export default DictionaryInfo;
