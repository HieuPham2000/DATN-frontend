import { memo, useMemo } from 'react';
import { Button, TextField } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import { updateDictionary } from '~/services/dictionaryService';

const schema = yup.object().shape({
    dictionaryName: yup.string().trim().required('Dictionary Name is required'),
});
function EditDictionaryDialog({ open, onClose, dictId, dictName }) {
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset, setError } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            dictionaryName: dictName || '',
        },
        resolver: yupResolver(schema),
    });

    const dictionaryName = useWatch({
        control,
        name: 'dictionaryName',
    });

    const { data: accountInfo } = useAccountInfo();
    const currentDictionaryId = useMemo(() => accountInfo?.Dictionary?.DictionaryId, [accountInfo]);

    const { mutate: editDictionary } = useMutation(
        async (data) => {
            const res = await updateDictionary(dictId, data.dictionaryName);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.EditDictionary.Type,
                        Reference: `Dictionary: ${dictName}`,
                        Description: `Rename to "${dictionaryName}"`,
                    };
                    saveLog(logParam);

                    reset();

                    onClose();

                    if (dictId === currentDictionaryId) {
                        queryClient.invalidateQueries(['accountInfo']);
                    }
                    queryClient.invalidateQueries(['listDictionary']);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Update failed');
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err2001) {
                        setError(
                            'dictionaryName',
                            { type: HUSTConstant.ErrorCode.Err2001, message: data.Message },
                            { shouldFocus: true },
                        );
                    }
                } else {
                    toast.error('Update failed');
                }
            },
        },
    );

    const handleClose = () => {
        reset();
        onClose();
    };

    const Content = (
        <>
            <Controller
                name="dictionaryName"
                control={control}
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <TextField
                        id="txtDictionaryName"
                        autoFocus
                        label="Dictionary Name (*)"
                        fullWidth
                        inputProps={{ maxLength: 255 }}
                        autoComplete="off"
                        {...field}
                        inputRef={ref}
                        error={!!error?.message}
                        title={error?.message}
                        helperText={error?.message}
                        sx={{ mt: 2 }}
                    />
                )}
            />
        </>
    );

    const Action = (
        <>
            <Button color="minor" onClick={handleClose}>
                Cancel
            </Button>
            <Button onClick={handleSubmit(editDictionary)}>Save</Button>
        </>
    );
    return <BaseDialog open={open} onClose={handleClose} title="Edit Dictionary" content={Content} actions={Action} />;
}

export default memo(EditDictionaryDialog);
