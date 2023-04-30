import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import menuList from '~/utils/base/menuList';
const cx = classNames.bind(styles);

function Menu() {
    return (
        <List className={cx('menu-list')}>
            {menuList.map((menuItem) => {
                let MenuItemIcon = menuItem.icon;

                return (
                    <ListItem key={menuItem.text} className={cx('menu-item')}>
                        <ListItemButton>
                            {menuItem.icon && (
                                <ListItemIcon>
                                    <MenuItemIcon />
                                </ListItemIcon>
                            )}

                            <ListItemText primary={menuItem.text} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default Menu;
