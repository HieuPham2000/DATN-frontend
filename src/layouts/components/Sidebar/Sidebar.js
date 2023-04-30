import { IconButton } from '@mui/material';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import logoImg from '~/assets/logos/logo-with-text-right.png';
import DictionaryInfo from '~/layouts/components/Sidebar/DictionaryInfo';
import Menu from '~/layouts/components/Sidebar/Menu';
import { ChevronLeft as ArrowIcon } from '@mui/icons-material';
import { useState } from 'react';
const cx = classNames.bind(styles);
function Sidebar() {
    const [collapseState, setCollapseState] = useState(false);

    return (
        <nav className={cx('wrapper', { collapsed: collapseState })}>
            <IconButton className={cx('btn-collapse')} onClick={() => setCollapseState(!collapseState)}>
                <ArrowIcon className={cx('ic-arrow')} />
            </IconButton>
            <div className={cx('logo-wrapper')}>
                <img className={cx('logo-img')} src={logoImg} alt="HUST PVO" />
            </div>
            <div className={cx('dictionary-info-wrapper')}>
                <DictionaryInfo />
            </div>
            <div className={cx('menu-wrapper')}>
                <Menu />
            </div>
        </nav>
    );
}

export default Sidebar;
