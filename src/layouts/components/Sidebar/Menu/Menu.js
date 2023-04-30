import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import menuList from '~/utils/base/menuList';
const cx = classNames.bind(styles);

function Menu({ collapsed }) {
    return (
        <List className={cx('menu-list', { collapsed: collapsed })}>
            {menuList
                .filter((menuItem) => collapsed || menuItem.text !== 'Dictionary')
                .map((menuItem) => {
                    let MenuItemIcon = menuItem.icon;

                    return (
                        <ListItem key={menuItem.text} className={cx('menu-item')}>
                            <ListItemButton className={cx('menu-item-btn')}>
                                {menuItem.icon && (
                                    <ListItemIcon className={cx('menu-item-btn-icon')}>
                                        <MenuItemIcon />
                                    </ListItemIcon>
                                )}

                                {!collapsed && <ListItemText primary={menuItem.text} />}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
        </List>
    );
}

export default Menu;
