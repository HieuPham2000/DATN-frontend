import { memo, useMemo, useState } from 'react';
import { Button, TextField } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import { addConcept } from '~/services/conceptService';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import Loading from '~/components/Loading/Loading';

const schema = yup.object().shape({
    title: yup.string().trim().required('Concept is required'),
});
function AddConceptDialog({
    open,
    onClose,
    defaultTitle = '',
    handleAfter = () => {},
    screenInfo = HUSTConstant.ScreenInfo.Concept,
}) {
    const { data: accountInfo } = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? '', [accountInfo]);

    const { handleSubmit, control, reset, setError, setFocus } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            title: defaultTitle || '',
            description: '',
        },
        resolver: yupResolver(schema),
    });

    const title = useWatch({
        control,
        name: 'title',
    });

    const [isClose, setIsClose] = useState(false);

    const handleClose = () => {
        reset({
            title: '',
            description: '',
        });
        onClose();
    };

    const handleClickAdd = () => {
        setIsClose(false);
        handleSubmit(handleAddConcept)();
    };

    const handleClickAddClose = () => {
        setIsClose(true);
        handleSubmit(handleAddConcept)();
    };

    const { mutate: handleAddConcept, isLoading } = useMutation(
        async (data) => {
            const res = await addConcept(data.title?.trim(), data.description?.trim());
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Add successfully');

                    let logDescription = `Add: ${title}`;
                    let logParam = {
                        ScreenInfo: screenInfo,
                        ActionType: HUSTConstant.LogAction.AddConcept.Type,
                        Reference: `Dictionary: ${dictionaryName}`,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    if (isClose) {
                        handleClose();
                    } else {
                        setFocus('title');
                        reset({
                            title: '',
                            description: '',
                        });
                    }

                    handleAfter(title);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Add failed');
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err3001) {
                        setError(
                            'title',
                            { type: HUSTConstant.ErrorCode.Err3001, message: data.Message },
                            { shouldFocus: true },
                        );
                    }
                } else {
                    toast.error('Add failed');
                }
            },
        },
    );

    const Content = (
        <>
            {isLoading && <Loading />}
            <Controller
                name="title"
                control={control}
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <TextField
                        id="txtTitle"
                        inputRef={ref}
                        autoFocus
                        label="Concept (*)"
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
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        id="txtDescription"
                        label="Description"
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={6}
                        inputProps={{ maxLength: 500 }}
                        autoComplete="off"
                        {...field}
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
            <Button onClick={handleClickAdd}>Add</Button>
            <Button onClick={handleClickAddClose}>Add & Close</Button>
        </>
    );

    return <BaseDialog open={open} onClose={handleClose} title="Add Concept" content={Content} actions={Action} />;
}

export default memo(AddConceptDialog);
