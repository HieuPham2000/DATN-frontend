import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './UserMenu.module.scss';
import { stringAvatar } from '~/utils/common/common';
import { useState, Fragment, useMemo } from 'react';
import {
    LogoutTwoTone as LogoutIcon,
    SettingsTwoTone as SettingIcon,
    HistoryToggleOffTwoTone as HistoryIcon,
    FeedbackTwoTone as FeedbackIcon,
} from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '~/services/accountService';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { clearUserSession } from '~/utils/httpRequest';
import { useQueryClient } from '@tanstack/react-query';
import FeedbackDialog from '~/components/FeedbackDialog';
import useAccountInfo from '~/hooks/data/useAccountInfo';

const cx = classNames.bind(styles);

function UserMenu() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: accountInfo } = useAccountInfo();
    const user = useMemo(() => accountInfo?.User ?? {}, [accountInfo]);
    const displayName = useMemo(() => user.DisplayName || user.Email, [user]);

    const [openFeedback, setOpenFeedback] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFeedback = () => {
        setOpenFeedback(true);
        handleClose();
    };

    const handleLogout = async () => {
        try {
            await logout();
            clearUserSession();
            // await queryClient.invalidateQueries('me');

            queryClient.clear();
            queryClient.setQueryData(['isAuthenticate'], false);
            // await queryClient.invalidateQueries(['isAuthenticate']);
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error(HUSTConstant.ToastMessage.GeneralError);
        }
    };

    return (
        <Fragment>
            <FeedbackDialog open={openFeedback} onClose={() => setOpenFeedback(false)} userEmail={user.Email} />
            <Tooltip title="Account">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        {...stringAvatar(displayName)}
                        className={cx('avatar')}
                        sx={{
                            width: 40,
                            height: 40,
                            opacity: open ? 0.7 : 1,
                        }}
                        src={user.Avatar}
                        alt='avatar'
                    />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        borderRadius: 2,
                        '& .MuiDivider-root': {
                            mt: 1,
                            mb: 1,
                        },
                        '& .MuiMenuItem-root': {
                            margin: 1,
                            borderRadius: 1,
                            padding: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className={cx('wrapper-user-info')}>
                    <Typography variant="subtitle2">{displayName}</Typography>
                    {displayName !== user.Email && <Typography variant="body2">{user.Email}</Typography>}
                </div>

                <Divider />
                <MenuItem onClick={handleClose} component={NavLink} to="/account">
                    <ListItemIcon>
                        <SettingIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Settings</Typography>
                </MenuItem>
                <MenuItem onClick={handleClose} component={NavLink} to="/history">
                    <ListItemIcon>
                        <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">History</Typography>
                </MenuItem>
                <MenuItem onClick={handleFeedback}>
                    <ListItemIcon>
                        <FeedbackIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Feedback</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Logout</Typography>
                </MenuItem>
            </Menu>
        </Fragment>
    );
}

export default UserMenu;
