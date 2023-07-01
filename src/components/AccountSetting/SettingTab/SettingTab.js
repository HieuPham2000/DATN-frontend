import classNames from 'classnames/bind';
import styles from './SettingTab.module.scss';
import { Button, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import HUSTConstant from '~/utils/common/constant';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '~/services/userService';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading/Loading';
import { saveLog } from '~/services/auditLogService';
import { stylePaper } from '~/utils/style/muiCustomStyle';

const cx = classNames.bind(styles);

function SettingTab() {
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

    /**
     * Call api
     */
    const { mutate: handleSave, isLoading } = useMutation(
        async (data) => {
            const res = await updatePassword(data.oldPassword, data.newPassword);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.AccountSettingSecurityTab,
                        ActionType: HUSTConstant.LogAction.ChangePassword.Type,
                    };
                    saveLog(logParam);
                    reset();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err1000) {
                        data.Message = 'Incorrect password';
                    }
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
