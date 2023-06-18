import { Button, Tooltip } from '@mui/material';
import styles from './DictionaryInfo.module.scss';
import classNames from 'classnames/bind';
import { ChangeCircle as ChangeDictionaryIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import { useMemo } from 'react';
const cx = classNames.bind(styles);

function DictionaryInfo() {
    const {data: accountInfo} = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? "", [accountInfo]);
    return (
        <div className={cx('wrapper')}>
            <Tooltip title={`Current dictionary: ${dictionaryName}. Change?`}>
                <Button className={cx('wrapper-txt-dictionary')} component={Link} to="/dictionary">
                    <ChangeDictionaryIcon color="primary" className={cx('ic-change')} />
                    <div className={cx('dictionary-label')}>Current dictionary</div>
                    <div className={cx('dictionary-name')}>{dictionaryName}</div>
                </Button>
            </Tooltip>
        </div>
    );
}

export default DictionaryInfo;
