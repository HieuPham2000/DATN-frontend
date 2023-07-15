import { memo, useMemo } from 'react';
import { Autocomplete, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import BaseDialog from '~/components/BaseComponent/BaseDialog';
import { getListDictionary, transferDictionary } from '~/services/dictionaryService';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { Enum } from '~/utils/common/enumeration';
import Loading from '~/components/Loading';
import useAccountInfo from '~/hooks/data/useAccountInfo';

const schema = yup.object().shape({
    destDictionaryName: yup.string().required('Destination Dictionary is required'),
});

function TransferDialog({ open, onClose, dictId, dictName }) {
    const queryClient = useQueryClient();
    const { data: accountInfo } = useAccountInfo();
    const currentDictionary = useMemo(() => accountInfo?.Dictionary, [accountInfo]);

    const { handleSubmit, control, reset, setValue } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            destDictionaryName: null,
            isDeleteData: false,
        },
        resolver: yupResolver(schema),
    });

    const destDictionaryName = useWatch({
        control,
        name: 'destDictionaryName',
    });
    const isDeleteData = useWatch({
        control,
        name: 'isDeleteData',
    });

    const { data: dictionaries } = useQuery({
        queryKey: ['listDictionary'],
        queryFn: async () => {
            const res = await getListDictionary();
            return res.data.Data;
        },
    });

    const destDictionaryOptions = useMemo(() => {
        let mapName = (dictionaries || []).filter((x) => x.DictionaryId !== dictId).map((x) => x.DictionaryName);
        mapName.sort();
        return mapName;
    }, [dictionaries, dictId]);

    const { mutate: transfer, isLoading } = useMutation(
        async (data) => {
            let destDict = dictionaries?.find((x) => x.DictionaryName === data.destDictionaryName?.trim());
            const res = await transferDictionary({
                SourceDictionaryId: dictId,
                DestDictionaryId: destDict?.DictionaryId,
                IsDeleteData: data.isDeleteData,
            });
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Transfer successfully');

                    let logDescription = `Copy data from "${dictName}" to "${destDictionaryName}"`;
                    if (isDeleteData) {
                        logDescription = `Clear data in "${destDictionaryName}". ` + logDescription;
                    }
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.TransferDictionaryData.Type,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    reset();

                    handleClose();

                    // 15.07.2023: invalidate để load lại form View all concepts
                    if (
                        destDictionaryName &&
                        currentDictionary &&
                        destDictionaryName === currentDictionary.DictionaryName
                    ) {
                        queryClient.invalidateQueries(['searchConcept']);
                    }
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err2003) {
                        toast.warning(data.Message);
                    } else {
                        toast.error(data.Message || 'Transfer failed');
                    }
                } else {
                    toast.error('Transfer failed');
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
            <Typography>Copy data from "{dictName}" (Source Dictionary) to:</Typography>
            <Controller
                name="destDictionaryName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                        id="txtDestDictionaryName"
                        options={destDictionaryOptions}
                        selectOnFocus
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                autoFocus
                                {...params}
                                inputProps={{ ...params.inputProps, maxLength: 255 }}
                                label="Destination Dictionary (*)"
                                error={!!error?.message}
                                title={error?.message}
                                helperText={error?.message}
                            />
                        )}
                        {...field}
                        onChange={(event, newValue) =>
                            setValue('destDictionaryName', newValue, { shouldValidate: true })
                        }
                        // onChange={(event, newValue) => field.onChange(newValue)}
                        sx={{ mt: 2 }}
                    />
                )}
            />
            <Controller
                name="isDeleteData"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                        id="ckbIsDeleteData"
                        label="Delete data in destination before transferring data to"
                        control={<Checkbox />}
                        checked={value}
                        onChange={onChange}
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
            <Button onClick={handleSubmit(transfer)}>Transfer</Button>
        </>
    );
    return (
        <>
            {isLoading && <Loading />}
            <BaseDialog open={open} onClose={handleClose} title="Transfer" content={Content} actions={Action} />
        </>
    );
}

export default memo(TransferDialog);
