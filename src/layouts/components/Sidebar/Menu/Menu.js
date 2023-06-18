import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import menuList from '~/utils/base/menuList';
import { NavLink, useLocation } from 'react-router-dom';
const cx = classNames.bind(styles);

function Menu({ collapsed }) {
    const { pathname } = useLocation();
    return (
        <List className={cx('menu-list', { collapsed: collapsed })}>
            {menuList
                .filter((menuItem) => collapsed || menuItem.text !== 'Dictionary')
                .map((menuItem) => {
                    let MenuItemIcon = menuItem.icon;
                    let isActive = pathname === menuItem.link || (pathname === '/' && menuItem.default);
                    return (
                        <ListItem key={menuItem.text} className={cx('menu-item')}>
                            <Tooltip title={collapsed ? menuItem.text : ''} placement="right">
                                <ListItemButton
                                    className={cx('menu-item-btn', { active: isActive })}
                                    component={NavLink}
                                    to={menuItem.link}

                                    // style={({ isActive }) =>
                                    //     isActive
                                    //         ? {
                                    //               backgroundColor: 'lightgray',
                                    //           }
                                    //         : null
                                    // }
                                    // sx={{ '&.active': { background: 'primary' } }}
                                >
                                    {menuItem.icon && (
                                        <ListItemIcon className={cx('menu-item-btn-icon')}>
                                            <MenuItemIcon className={cx('icon')} />
                                        </ListItemIcon>
                                    )}

                                    {!collapsed && (
                                        <ListItemText className={cx('menu-item-btn-text')}>
                                            <Typography variant="body2">{menuItem.text}</Typography>
                                        </ListItemText>
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
        </List>
    );
}

export default Menu;
