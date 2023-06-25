import { memo, useMemo } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import { addDictionary } from '~/services/dictionaryService';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';

const schema = yup.object().shape({
    dictionaryName: yup.string().required('Dictionary Name is required'),
});
function AddDictionaryDialog({ open, onClose, dictionaries }) {
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            dictionaryName: '',
            cloneFrom: null,
        },
        resolver: yupResolver(schema),
    });

    const dictionaryName = useWatch({
        control,
        name: 'dictionaryName',
    });
    const cloneFrom = useWatch({
        control,
        name: 'cloneFrom',
    });

    const cloneFromOptions = useMemo(() => (dictionaries || []).map((x) => x.DictionaryName), [dictionaries]);

    const { mutate: createDictionary } = useMutation(
        async (data) => {
            let cloneFromDictionary = dictionaries?.find((x) => x.DictionaryName === data.cloneFrom?.trim());
            const res = await addDictionary(data.dictionaryName?.trim(), cloneFromDictionary?.DictionaryId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Create successfully');

                    let logDescription = `Create: ${dictionaryName}`;
                    if (cloneFrom) {
                        logDescription += ` (Clone data from dictionary: ${cloneFrom})`;
                    }
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.AddDictionary.Type,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    reset();

                    onClose();

                    queryClient.invalidateQueries(['listDictionary']);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Create failed');
                } else {
                    toast.error('Create failed');
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
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        id="txtDictionaryName"
                        autoFocus
                        label="Dictionary Name (*)"
                        fullWidth
                        inputProps={{ maxLength: 255 }}
                        autoComplete="off"
                        {...field}
                        error={!!error?.message}
                        title={error?.message}
                        helperText={error?.message}
                        sx={{ mt: 2 }}
                    />
                )}
            />
            <Controller
                name="cloneFrom"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        id="txtCloneFrom"
                        options={cloneFromOptions}
                        // getOptionLabel={(option) => {
                        //     return option?.DictionaryName;
                        // }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{ ...params.inputProps, maxLength: 255 }}
                                label="Clone Data From"
                                onChange={onChange}
                            />
                        )}
                        onChange={(event, values, reason) => onChange(values)}
                        value={value}
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
            <Button onClick={handleSubmit(createDictionary)}>Create</Button>
        </>
    );
    return (
        <BaseDialog open={open} onClose={handleClose} title="Create Dictionary" content={Content} actions={Action} />
    );
}

export default memo(AddDictionaryDialog);
