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
import Draggable from 'react-draggable';

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

    const handleCloseConceptDialog = useCallback(() => {
        setOpenConceptDialog(false);
    }, []);

    useHotkeys('alt+c', handleOpenConceptDialog);
    useHotkeys('ctrl+q', handleCloseConceptDialog);

    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        setStartX(touch.clientX);
        setStartY(touch.clientY);
    };

    const handleTouchEnd = (event) => {
        const touch = event.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        if (distance < 5) {
            handleOpenConceptDialog();
        }
    };
    return (
        <div className={cx('wrapper')}>
            <ListConceptDialog open={openConceptDialog} onClose={handleCloseConceptDialog} />
            
            {windowSize.width < HUSTConstant.WindowSize.Lg ? (
                <Drawer
                    anchor="left"
                    open={showDrawer}
                    onClose={toggleDrawer(false)}
                    sx={{ zIndex: 99999, position: 'relative' }}
                >
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
            </div>
            <Draggable nodeRef={fabRef} bounds="parent">
                <Fab
                    ref={fabRef}
                    aria-label="View all concepts"
                    className={cx('btn-fab')}
                    onClick={handleOpenConceptDialog}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    // onTouchStart={handleOpenConceptDialog}
                >
                    <Tooltip title="View all concepts (Alt+C)">
                        <DictionaryIcon color="primary" className={cx('btn-fab-icon')} />
                    </Tooltip>
                </Fab>
            </Draggable>
        </div>
    );
}

export default DefaultLayout;
