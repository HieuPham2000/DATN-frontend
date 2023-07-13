import { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import ToggleDarkMode from '~/components/ToggleDarkMode';
import HUSTConstant from '~/utils/common/constant';
import DictionaryInfo from '~/layouts/components/Header/DictionaryInfo';
import useWindowSize from '~/hooks/useWindowSize';
import { useCollapseSidebar } from '~/stores';
import UserMenu from '~/layouts/components/Header/UserMenu';
import { HelpTwoTone as HelpIcon } from '@mui/icons-material';
import Utility from '~/layouts/components/Header/Utility';

const cx = classNames.bind(styles);

function Header({ toggleDrawer }) {
    const isCollapsedSidebar = useCollapseSidebar((state) => state.collapsed);
    const windowSize = useWindowSize();

    // Có 3 khoảng:
    // 1. width < sm: lúc này sidebar nằm trong drawer, nhưng màn bé => hiển thị kiểu small dictionary info
    // 2. sm <= width < lg: lúc này sidebar nằm trong drawer, nhưng màn to tương đối => hiển thị kiểu full dictionary info
    // 3. width > lg: lúc này sidebar không ở trong drawer, có thể collapse => hiển thị kiểu small khi sidebar không bị collapse
    const isSmallDictionaryInfo =
        windowSize.width < HUSTConstant.WindowSize.Sm ||
        (windowSize.width >= HUSTConstant.WindowSize.Lg && !isCollapsedSidebar);

    const handleClickHelp = () => {
        // toast.info('Coming soon');
        window.open('https://hieupham2000.github.io/HUSTPVO-documentation/', '_blank');
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('wrapper-left')}>
                {windowSize.width < HUSTConstant.WindowSize.Lg && (
                    <IconButton className={cx('btn-toggle-drawer')} onClick={toggleDrawer} aria-label="menu-icon">
                        <MenuIcon />
                    </IconButton>
                )}
                <DictionaryInfo small={isSmallDictionaryInfo} />
            </div>
            <div className={cx('wrapper-right')}>
                <Utility />
                <Tooltip title="Help & FAQs">
                    <IconButton
                        className={cx('btn-help')}
                        onClick={handleClickHelp}
                        aria-label="button-help"
                        sx={{ mr: 1 }}
                    >
                        <HelpIcon style={{ fontSize: 28 }} color="minor" />
                    </IconButton>
                </Tooltip>
                <ToggleDarkMode />

                <UserMenu />
            </div>
        </header>
    );
}

export default memo(Header);
