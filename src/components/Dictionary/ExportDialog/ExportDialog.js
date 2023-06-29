import { memo } from 'react';
import { Button, Stack } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import { getNumberRecord } from '~/services/dictionaryService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import exportImg from '~/assets/images/export.svg';
import { backupDictionary, exportDictionary } from '~/services/templateService';
import { HttpStatusCode } from 'axios';

function ExportDialog({ open, onClose, dictId, dictName }) {
    const { data: numberRecord } = useQuery({
        queryKey: ['numberRecord', dictId],
        queryFn: async () => {
            const res = await getNumberRecord(dictId);
            return res.data.Data;
        },
    });

    const { mutate: downloadExportFile, isLoading: isLoadingDownload } = useMutation(
        async () => {
            const res = await exportDictionary(dictId);
            return res;
        },
        {
            onSuccess: (data) => {
                if (data?.status === HttpStatusCode.Ok) {
                    toast.success('Download successfully');
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.ExportData.Type,
                        Reference: `Dictionary: ${dictName}`,
                        Description: 'Download export file',
                    };
                    saveLog(logParam);
                    handleClose();
                } else if (data?.status === HttpStatusCode.NoContent) {
                    toast.error('No data');
                } else {
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                }
            },
        },
    );

    const { mutate: sendExportFile, isLoading: isLoadingSendMail } = useMutation(
        async () => {
            const res = await backupDictionary(dictId);
            return res;
        },
        {
            onSuccess: (data) => {
                if (data?.status === HttpStatusCode.Ok) {
                    toast.success('Send successfully');
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.ExportData.Type,
                        Reference: `Dictionary: ${dictName}`,
                        Description: 'Send export file to email',
                    };
                    saveLog(logParam);
                    handleClose();
                } else if (data?.status === HttpStatusCode.NoContent) {
                    toast.error('No data');
                } else {
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                }
            },
        },
    );

    const handleClose = () => {
        onClose();
    };

    const handleDownload = () => {
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            downloadExportFile();
        } else {
            toast.warning('Dictionary has no data');
        }
    };

    const handleSendToEmail = () => {
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            sendExportFile();
        } else {
            toast.warning('Dictionary has no data');
        }
    };

    const Content = (
        <>
            <Stack alignItems="center" justifyContent="center" spacing={1}>
                <img src={exportImg} alt="Export" style={{ maxWidth: '60%' }}></img>
                <Button
                    sx={{ mt: 1, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleDownload}
                >
                    Download
                </Button>
                <Button sx={{ mt: 1, textTransform: 'none' }} size="large" fullWidth onClick={handleSendToEmail}>
                    Send to email (Backup data)
                </Button>
            </Stack>
        </>
    );

    const Action = <></>;
    return (
        <>
            <BaseDialog
                open={open}
                onClose={handleClose}
                title="Export Options"
                content={Content}
                actions={Action}
                isLoading={isLoadingDownload || isLoadingSendMail}
            />
        </>
    );
}

export default memo(ExportDialog);
