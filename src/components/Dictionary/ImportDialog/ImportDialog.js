import { memo } from 'react';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import ImportDialogContent from '~/components/Dictionary/ImportDialog/ImportDialogContent';

function ImportDialog({ open, onClose, dictId, dictName }) {
    const Content = (
        <>
            <ImportDialogContent dictId={dictId} dictName={dictName} onClose={onClose} />
        </>
    );

    const handleClose = () => {
        onClose();
    };

    const Action = <></>;
    return (
        <>
            <BaseDialog
                open={open}
                onClose={handleClose}
                title={`Import data into: ${dictName}`}
                content={Content}
                actions={Action}
                isFullScreen
            />
        </>
    );
}

export default memo(ImportDialog);
