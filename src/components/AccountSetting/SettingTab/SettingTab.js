import classNames from 'classnames/bind';
import styles from './SettingTab.module.scss';
import { Button, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import HUSTConstant from '~/utils/common/constant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading/Loading';
import { saveLog } from '~/services/auditLogService';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { getUserSettingByKey, saveUserSettingWithKey } from '~/services/userSettingService';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function SettingTab() {
    const queryClient = useQueryClient();
    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty },
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            isSearchSoundex: false,
        },
    });

    const { data: settingData } = useQuery({
        queryKey: ['userSetting', HUSTConstant.UserSettingKey.IsSearchSoundex],
        queryFn: async () => {
            const res = await getUserSettingByKey(HUSTConstant.UserSettingKey.IsSearchSoundex);
            return res.data.Data;
        },
        staleTime: 30000,
    });

    useEffect(() => {
        reset({
            isSearchSoundex: settingData?.SettingValue === 'true',
        });
    }, [settingData, reset]);

    const { mutate: handleSave, isLoading } = useMutation(
        async (data) => {
            const res = await saveUserSettingWithKey(HUSTConstant.UserSettingKey.IsSearchSoundex, data.isSearchSoundex);
            return res.data;
        },
        {
            onSuccess: (data, reqData) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');
                    queryClient.invalidateQueries(['userSetting', HUSTConstant.UserSettingKey.IsSearchSoundex]);
                    let description = '';
                    if (reqData.isSearchSoundex) {
                        description = 'Check "Use Soundex Search..."';
                    } else {
                        description = 'Uncheck "Use Soundex Search..."';
                    }
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.AccountSettingSettingTab,
                        ActionType: HUSTConstant.LogAction.ChangeSetting.Type,
                        Description: description,
                    };
                    saveLog(logParam);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Update failed');
                } else {
                    toast.error('Update failed');
                }
            },
        },
    );

    const handleCancel = () => {
        reset();
    };

    return (
        <Paper
            className={cx('tab-content-wrapper')}
            sx={{
                ...stylePaper,
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 24px 16px 24px',
                marginBottom: '64px',
            }}
        >
            {isLoading && <Loading />}
            <Controller
                name="isSearchSoundex"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                        id="ckbIsSearchSoundex"
                        label="Use Soundex Search when searching for concepts"
                        control={<Checkbox />}
                        checked={value}
                        onChange={onChange}
                        sx={{ mt: 2 }}
                    />
                )}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isDirty && (
                    <Button
                        sx={{ mt: 2, mb: 1, mr: 2, display: 'inline-block', minWidth: 100 }}
                        variant="outline"
                        size="large"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                )}
                <LoadingButton
                    sx={{ mt: 2, mb: 1, display: 'inline-block', minWidth: 100 }}
                    variant="contained"
                    size="large"
                    onClick={handleSubmit(handleSave)}
                    loading={isLoading}
                    disabled={!isDirty}
                >
                    Save
                </LoadingButton>
            </div>
        </Paper>
    );
}

export default SettingTab;
