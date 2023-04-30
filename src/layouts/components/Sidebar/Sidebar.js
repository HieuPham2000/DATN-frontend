import { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { ChevronLeft as ArrowIcon } from '@mui/icons-material';
import classNames from 'classnames/bind';

import logoImg from '~/assets/logos/logo-with-text-right.png';
import styles from './Sidebar.module.scss';
import DictionaryInfo from '~/layouts/components/Sidebar/DictionaryInfo';
import Menu from '~/layouts/components/Sidebar/Menu';
import { useCollapseSidebar } from '~/stores';

const cx = classNames.bind(styles);

function Sidebar({ insideDrawer }) {
    const collapsed = useCollapseSidebar((state) => state.collapsed);
    const setCollapsed = useCollapseSidebar((state) => state.setCollapsed);

    useEffect(() => {
        setCollapsed(false);
    }, [setCollapsed]);

    return (
        <nav className={cx('wrapper', { collapsed: collapsed }, { 'inside-drawer': insideDrawer })}>
            <IconButton className={cx('btn-collapse')} onClick={() => setCollapsed(!collapsed)}>
                <ArrowIcon className={cx('ic-arrow')} />
            </IconButton>
            <div className={cx('logo-wrapper')}>
                <img className={cx('logo-img')} src={logoImg} alt="HUST PVO" />
            </div>
            <div className={cx('dictionary-info-wrapper')}>
                <DictionaryInfo />
            </div>
            <div className={cx('menu-wrapper')}>
                <Menu collapsed={collapsed} />
            </div>
        </nav>
    );
}

export default Sidebar;
