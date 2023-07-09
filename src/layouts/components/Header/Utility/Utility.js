import { IconButton, Tooltip } from '@mui/material';
import HelperDialog from '~/components/Helper/HelperDialog';
import { TipsAndUpdatesTwoTone as TipsIcon } from '@mui/icons-material';
import { memo, useCallback, useState } from 'react';

function Utility() {
    const [openHelperDialog, setOpenHelperDialog] = useState(false);

    const handleOpenHelperDialog = () => {
        setOpenHelperDialog(true);
    };

    const handleCloseHelperDialog = useCallback(() => {
        setOpenHelperDialog(false);
    }, []);

    const handleClickTips = () => {
        handleOpenHelperDialog();
    };

    return (
        <>
            <HelperDialog open={openHelperDialog} onClose={handleCloseHelperDialog} />
            <Tooltip title="Utility">
                <IconButton onClick={handleClickTips} aria-label="button-tips" sx={{ mr: 1 }}>
                    <TipsIcon style={{ fontSize: 28 }} color="minor" />
                </IconButton>
            </Tooltip>
        </>
    );
}

export default memo(Utility);
