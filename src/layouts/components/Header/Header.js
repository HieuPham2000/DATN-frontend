import { memo } from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import ToggleDarkMode from '~/components/ToggleDarkMode';
import HUSTConstant from '~/utils/common/constant';
import DictionaryInfo from '~/layouts/components/Header/DictionaryInfo';
import useWindowSize from '~/hooks/useWindowSize';
import { useCollapseSidebar } from '~/stores';
import UserMenu from '~/layouts/components/Header/UserMenu';

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

    return (
        <header className={cx('wrapper')}>
            <div className={cx('wrapper-left')}>
                {windowSize.width < HUSTConstant.WindowSize.Lg && (
                    <IconButton className={cx('btn-toggle-drawer')} onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                )}
                <DictionaryInfo small={isSmallDictionaryInfo} />
            </div>
            <div className={cx('wrapper-right')}>
                <ToggleDarkMode />
                {/* <Avatar
                    {...stringAvatar('Hieu Pham')}
                    src="https://scontent.fhan4-2.fna.fbcdn.net/v/t39.30808-1/322942734_655434292997879_995178307131386601_n.jpg?stp=dst-jpg_s320x320&_nc_cat=106&ccb=1-7&_nc_sid=7206a8&_nc_ohc=A-8qKCYccBMAX_7VOfp&_nc_ht=scontent.fhan4-2.fna&oh=00_AfBRZK-e21TqkF3dJIqWeQXkeOMNXerxc0fgNzRJh0b46A&oe=64511BE4"
                /> */}
                <UserMenu />
            </div>
        </header>
    );
}

export default memo(Header);
