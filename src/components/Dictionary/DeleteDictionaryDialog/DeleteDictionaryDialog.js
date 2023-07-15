import { memo, useMemo, useState } from 'react';
import { Button, Stack } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import { deleteDictionary, deleteDictionaryData, getNumberRecord } from '~/services/dictionaryService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import AlertDialog from '~/components/BaseComponent/AlertDialog';
import { formatNumber } from '~/utils/common/utils';
import deleteImg from '~/assets/images/delete.svg';

function DeleteDictionaryDialog({ open, onClose, dictId, dictName }) {
    const queryClient = useQueryClient();
    const { data: accountInfo } = useAccountInfo();
    const currentDictionaryId = useMemo(() => accountInfo?.Dictionary?.DictionaryId, [accountInfo]);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        content: '',
        action: () => {},
    });

    const { data: numberRecord } = useQuery({
        queryKey: ['numberRecord', dictId],
        queryFn: async () => {
            const res = await getNumberRecord(dictId);
            return res.data.Data;
        },
    });

    const { mutate: deleteDict } = useMutation(
        async () => {
            const res = await deleteDictionary(dictId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Delete successfully');

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.DeleteDictionary.Type,
                        Reference: `Dictionary: ${dictName}`,
                    };
                    saveLog(logParam);
                    handleClose();
                    queryClient.invalidateQueries(['listDictionary']);

                    // 15.07.2023: invalidate để load lại form View all concepts
                    if (dictId === currentDictionaryId) {
                        queryClient.invalidateQueries(['searchConcept']);
                    }
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Delete failed');
                } else {
                    toast.error('Delete failed');
                }
            },
        },
    );

    const { mutate: clearDict } = useMutation(
        async () => {
            const res = await deleteDictionaryData(dictId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Clear data successfully');

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.DeleteDictionaryData.Type,
                        Reference: `Dictionary: ${dictName}`,
                    };
                    saveLog(logParam);
                    handleClose();

                    // 15.07.2023: invalidate để load lại form View all concepts
                    if (dictId === currentDictionaryId) {
                        queryClient.invalidateQueries(['searchConcept']);
                    }
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Clear data failed');
                } else {
                    toast.error('Clear data failed');
                }
            },
        },
    );

    const handleClose = () => {
        handleCloseAlert();
        onClose();
    };

    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleDelete = () => {
        // Check số lượng > 0
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            setAlertConfig({
                title: 'Confirm dictionary deletion',
                content: getAlertContent(),
                action: deleteDict,
            });
            handleOpenAlert(true);
        } else {
            deleteDict();
        }
    };

    const handleClearData = () => {
        // Check số lượng > 0
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            setAlertConfig({
                title: 'Confirm data deletion',
                content: getAlertContent(),
                action: clearDict,
            });
            handleOpenAlert(true);
        } else {
            clearDict();
        }
    };

    const getAlertContent = () => {
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            let alertContent = `${formatNumber(numberRecord.NumberConcept)} concept(s) and ${formatNumber(
                numberRecord.NumberExample,
            )} example(s) in this dictionary will be lost and cannot be recovered. Are you sure?`;
            return alertContent;
        }
        return '';
    };

    const Content = (
        <Stack alignItems="center" justifyContent="center" spacing={1}>
            <img src={deleteImg} alt="Delete" style={{ maxWidth: '60%' }}></img>
            <Button
                sx={{ mt: 1, textTransform: 'none' }}
                variant="outlined"
                size="large"
                fullWidth
                color="error"
                onClick={handleClearData}
            >
                Clear data
            </Button>
            <Button
                sx={{ mt: 1, textTransform: 'none' }}
                variant="outlined"
                size="large"
                fullWidth
                color="error"
                onClick={handleDelete}
                disabled={dictId === currentDictionaryId}
            >
                Delete dictionary
            </Button>
        </Stack>
    );

    const Action = <></>;
    return (
        <>
            <AlertDialog
                title={alertConfig.title}
                content={alertConfig.content}
                open={openAlert}
                onClose={handleCloseAlert}
            >
                <Button color="minor" size="large" onClick={handleCloseAlert}>
                    Cancel
                </Button>
                <Button color="error" size="large" onClick={alertConfig.action}>
                    Delete
                </Button>
            </AlertDialog>
            <BaseDialog open={open} onClose={handleClose} title="Delete Options" content={Content} actions={Action} />
        </>
    );
}

export default memo(DeleteDictionaryDialog);
