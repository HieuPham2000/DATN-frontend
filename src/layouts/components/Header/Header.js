import classNames from 'classnames/bind';
import { Avatar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { stringAvatar } from '~/utils/common/common';
import styles from './Header.module.scss';
import ToggleDarkMode from '~/components/ToggleDarkMode';
import useWindowSize from '~/hooks/useWindowSize';
import HUSTConstant from '~/utils/common/constant';
import { memo } from 'react';
import DictionaryInfo from '~/layouts/components/Header/DictionaryInfo';

const cx = classNames.bind(styles);

function Header({ toggleDrawer }) {
    const windowSize = useWindowSize();
    return (
        <header className={cx('wrapper')}>
            <div className={cx('wrapper-left')}>
                {windowSize.width < HUSTConstant.WindowSize.Lg && (
                    <IconButton className={cx('btn-toggle-drawer')} onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                )}
                {/* <Tooltip title="Current dictionary: My first PVO">
                    <Button className={cx('wrapper-dictionary')}>
                        <BookIcon color="primary" />
                        <div className={cx('dictionary-name')}>My first PVO</div>
                    </Button>
                </Tooltip> */}
                {/* <DictionaryInfo onlyShowIcon={windowSize.width < HUSTConstant.WindowSize.Sm} /> */}
                <DictionaryInfo onlyShowIcon />
            </div>
            <div className={cx('wrapper-right')}>
                <ToggleDarkMode />
                <Avatar
                    {...stringAvatar('Hieu Pham')}
                    src="https://scontent.fhan4-2.fna.fbcdn.net/v/t39.30808-1/322942734_655434292997879_995178307131386601_n.jpg?stp=dst-jpg_s320x320&_nc_cat=106&ccb=1-7&_nc_sid=7206a8&_nc_ohc=A-8qKCYccBMAX_7VOfp&_nc_ht=scontent.fhan4-2.fna&oh=00_AfBRZK-e21TqkF3dJIqWeQXkeOMNXerxc0fgNzRJh0b46A&oe=64511BE4"
                />
            </div>
        </header>
    );
}

export default memo(Header);
