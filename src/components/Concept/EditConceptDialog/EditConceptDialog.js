import { memo, useEffect, useMemo } from 'react';
import { Button, TextField } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import { getConcept, updateConcept } from '~/services/conceptService';
import useAccountInfo from '~/hooks/data/useAccountInfo';

const schema = yup.object().shape({
    title: yup.string().trim().required('Concept is required'),
});
function EditConceptDialog({
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

    const { handleSubmit, control, reset, setError, setValue } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            title: concept?.Title,
            description: concept?.Description,
        },
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setValue('title', concept?.Title ?? '');
        setValue('description', concept?.Description ?? '');
    }, [concept, setValue]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const { mutate: handleEditConcept } = useMutation(
        async (data) => {
            const res = await updateConcept(conceptId, data.title?.trim(), data.description?.trim());
            return res.data;
        },
        {
            onSuccess: (data, updateData) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');

                    let logDescription = '';
                    if (updateData.title !== concept?.Title) {
                        logDescription += `Update title: "${concept?.Title || ''}" to "${updateData.title?.trim()}". `;
                    }
                    if (updateData.description !== concept?.Title) {
                        logDescription += `Update description: "${
                            concept?.Description || ''
                        }" to "${updateData.description?.trim()}". `;
                    }
                    let logParam = {
                        ScreenInfo: screenInfo,
                        ActionType: HUSTConstant.LogAction.EditConcept.Type,
                        Reference: `Dictionary: ${dictionaryName}`,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    handleAfter();

                    handleClose();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Update failed');
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err3001) {
                        setError(
                            'title',
                            { type: HUSTConstant.ErrorCode.Err3001, message: data.Message },
                            { shouldFocus: true },
                        );
                    }
                } else {
                    toast.error('Update failed');
                }
            },
        },
    );

    const Content = (
        <>
            {/* {isLoadingEdit && <Loading />} */}
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
                        InputProps={{ readOnly: isLoadingConcept }}
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
                        InputProps={{ readOnly: isLoadingConcept }}
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
            <Button onClick={handleSubmit(handleEditConcept)}>Save</Button>
        </>
    );

    return <BaseDialog open={open} onClose={handleClose} title="Edit Concept" content={Content} actions={Action} />;
}

export default memo(EditConceptDialog);
