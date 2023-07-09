import { memo } from 'react';
import { Box, Tab } from '@mui/material';
import { FindInPage, Translate } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
import useLocalStorage from '~/hooks/useLocalStorage';
import styles from './HelperDialogContent.module.scss';
import classNames from 'classnames/bind';
import TranslateTab from '~/components/Helper/TranslateTab';
import LookupTab from '~/components/Helper/LookupTab';

const cx = classNames.bind(styles);

function HelperDialogContent() {
    const [value, setValue] = useLocalStorage('utilityTab', 'translate');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label="Utility tab"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    <Tab
                        label="Translate"
                        value="translate"
                        icon={<Translate />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                    <Tab
                        label="Lookup"
                        value="lookup"
                        icon={<FindInPage />}
                        iconPosition="start"
                        className={cx('tab-title')}
                    />
                </TabList>
                {/* <TabPanel value="translate" sx={{ px: 0, py: 1 }}>
                    <TranslateTab />
                </TabPanel>
                <TabPanel value="lookup" sx={{ px: 0, py: 1 }}>
                    <LookupTab />
                </TabPanel> */}
                <Box sx={{ px: 0, py: 1 }}>
                    <div style={{ display: value === 'translate' ? 'block' : 'none' }}>
                        <TranslateTab />
                    </div>
                    <div style={{ display: value === 'lookup' ? 'block' : 'none' }}>
                        <LookupTab />
                    </div>
                </Box>
            </TabContext>
        </>
    );
}

export default memo(HelperDialogContent);
