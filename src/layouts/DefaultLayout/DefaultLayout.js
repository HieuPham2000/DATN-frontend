import { Suspense, useCallback, useRef, useState } from 'react';
import { Drawer, Fab, Tooltip } from '@mui/material';
import { AutoStoriesTwoTone as DictionaryIcon } from '@mui/icons-material';

import classNames from 'classnames/bind';

import styles from './DefaultLayout.module.scss';
import useWindowSize from '~/hooks/useWindowSize';
import HUSTConstant from '~/utils/common/constant';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import LoadingScreen from '~/components/LoadingScreen';
import ListConceptDialog from '~/components/Concept/ListConceptDialog/ListConceptDialog';
import { useHotkeys } from 'react-hotkeys-hook';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const fabRef = useRef(null);
    const [openConceptDialog, setOpenConceptDialog] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const windowSize = useWindowSize();

    const toggleDrawer = useCallback(
        (open) => (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }
            setShowDrawer(open);
        },
        [],
    );

    const handleOpenConceptDialog = (e) => {
        e?.preventDefault();
        setOpenConceptDialog(true);
    };

    const handleCloseConceptDialog = () => {
        setOpenConceptDialog(false);
    };

    useHotkeys('alt+c', handleOpenConceptDialog);
    useHotkeys('ctrl+q', handleCloseConceptDialog);

    return (
        <div className={cx('wrapper')}>
            {windowSize.width < HUSTConstant.WindowSize.Lg ? (
                <Drawer anchor="left" open={showDrawer} onClose={toggleDrawer(false)}>
                    <Sidebar insideDrawer />
                </Drawer>
            ) : (
                <div className={cx('wrapper-left')}>
                    <Sidebar />
                </div>
            )}
            <div className={cx('wrapper-right')}>
                <Header toggleDrawer={toggleDrawer(true)} />
                <main className={cx('content')}>
                    <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
                </main>
                <ListConceptDialog open={openConceptDialog} onClose={handleCloseConceptDialog} />
                <Fab
                    ref={fabRef}
                    aria-label="View all concepts"
                    className={cx('btn-fab')}
                    onClick={handleOpenConceptDialog}
                    onTouchEnd={handleOpenConceptDialog}
                >
                    <Tooltip title="View all concepts (Alt+C)">
                        <DictionaryIcon color="primary" className={cx('btn-fab-icon')} />
                    </Tooltip>
                </Fab>
            </div>
        </div>
    );
}

export default DefaultLayout;
