import { memo, useMemo } from 'react';
import { Button } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import { deleteConcept, getConcept } from '~/services/conceptService';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import AlertDialog from '~/components/BaseComponent/AlertDialog/AlertDialog';
import Loading from '~/components/Loading/Loading';

function DeleteConceptDialog({
    open,
    onClose,
    conceptId,
    handleAfter = () => {},
    screenInfo = HUSTConstant.ScreenInfo.Concept,
}) {
    const { data: accountInfo } = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? '', [accountInfo]);

    const { data: concept, isLoading: isLoadingConcept } = useQuery({
        queryKey: ['concept', conceptId],
        queryFn: async () => {
            const res = await getConcept(conceptId);
            return res.data.Data;
        },
    });

    const hasLinkedExample = useMemo(() => concept?.ListExample?.length, [concept]);

    const { mutate: handleDeleteConcept, isLoading: isLoadingDelete } = useMutation(
        async () => {
            const res = await deleteConcept(conceptId, true);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Delete successfully');

                    let logParam = {
                        ScreenInfo: screenInfo,
                        ActionType: HUSTConstant.LogAction.DeleteConcept.Type,
                        Reference: `Dictionary: ${dictionaryName}`,
                        Description: `Delete: ${concept?.Title || ''}`,
                    };
                    saveLog(logParam);

                    handleAfter();

                    handleClose();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Delete failed');
                } else {
                    toast.error('Delete failed');
                }
            },
        },
    );

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            {(isLoadingConcept || isLoadingDelete) && <Loading />}
            {hasLinkedExample ? (
                <AlertDialog
                    title="Confirm concept deletion"
                    content={`This concept is currently linked to ${concept?.ListExample.length} example(s). Do you want to search for linked examples, or continue deleting?`}
                    open={open}
                    onClose={handleClose}
                >
                    <Button color="minor" size="large" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color="error" size="large" onClick={handleDeleteConcept}>
                        Delete
                    </Button>
                    <Button size="large" onClick={handleClose}>
                        Search
                    </Button>
                </AlertDialog>
            ) : (
                <AlertDialog
                    title="Confirm concept deletion"
                    content="Deleted concept cannot be recovered. Are you sure?"
                    open={open}
                    onClose={handleClose}
                >
                    <Button color="minor" size="large" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color="error" size="large" onClick={handleDeleteConcept}>
                        Delete
                    </Button>
                </AlertDialog>
            )}
        </>
    );
}

export default memo(DeleteConceptDialog);
