import { Helmet } from 'react-helmet-async';
import styles from './UserSettingPage.module.scss';
import classNames from 'classnames/bind';
import { Tab, Typography } from '@mui/material';
import { AccountBox as GeneralIcon, VpnKey as SecurityIcon } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useState } from 'react';
import AccountSecurityTab from '~/components/AccountSecurityTab';
import AccountGeneralTab from '~/components/AccountGeneralTab';

const cx = classNames.bind(styles);

function UserSettingPage() {
    const [value, setValue] = useState('general');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Account Settings | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Account Settings</Typography>

            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label="Account settings tab">
                    <Tab
                        label="General"
                        value="general"
                        icon={<GeneralIcon />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                    <Tab
                        label="Security"
                        value="security"
                        icon={<SecurityIcon />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                </TabList>
                <TabPanel value="general">
                    <AccountGeneralTab />
                </TabPanel>
                <TabPanel value="security">
                    <AccountSecurityTab />
                </TabPanel>
            </TabContext>
        </div>
    );
}

export default UserSettingPage;
