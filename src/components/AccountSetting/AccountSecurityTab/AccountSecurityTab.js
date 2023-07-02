import classNames from 'classnames/bind';
import styles from './AccountSecurityTab.module.scss';
import { Button, Paper, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import PasswordTextField from '~/components/BaseComponent/PasswordTextField';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info } from '@mui/icons-material';
import HUSTConstant from '~/utils/common/constant';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '~/services/userService';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading/Loading';
import { saveLog } from '~/services/auditLogService';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    oldPassword: yup.string().required('Old Password is required'),
    newPassword: yup
        .string()
        .required('New Password is required')
        .test(
            'not-different',
            'Password must be different from the old password',
            (value, context) => value !== context.parent.oldPassword,
        )
        .password(),
    confirmNewPassword: yup
        .string()
        .test('match-password', "Password don't match", (value, context) => value === context.parent.newPassword),
});
function AccountSecurityTab() {
    const {
        handleSubmit,
        control,
        setFocus,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        resolver: yupResolver(schema),
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

    useEffect(() => {
        setFocus('oldPassword');
    }, [setFocus]);

    return (
        <Paper
            className={cx('tab-content-wrapper')}
            sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#212b36',
                boxShadow:
                    theme.palette.mode === 'light'
                        ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
                        : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
                zIndex: 0,
                backgroundImage: 'none',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 24px 16px 24px',
                marginBottom: '64px',
            })}
        >
            {isLoading && <Loading />}
            <Controller
                className={cx('control')}
                name="oldPassword"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <PasswordTextField
                        id="txtOldPassword"
                        label="Old Password"
                        inputProps={{ maxLength: 20, autoComplete: 'new-password' }}
                        {...field}
                        error={!!error?.message}
                        title={error?.message}
                        helperText={error?.message}
                    />
                )}
            />
            <Controller
                name="newPassword"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <PasswordTextField
                        id="txtNewPassword"
                        label="New Password"
                        inputProps={{ maxLength: 20, autoComplete: 'new-password' }}
                        {...field}
                        error={!!error?.message}
                        title={error?.message}
                        helperText={error?.message}
                    />
                )}
            />
            {!errors['newPassword'] && (
                <Typography variant="caption" color="text.secondary" className={cx('info-password')}>
                    <Info className={cx('ic-info')} fontSize="small" />
                    {HUSTConstant.ValidateMessage.Password}
                </Typography>
            )}
            <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <PasswordTextField
                        id="txtConfirmNewPassword"
                        label="Confirm New Password"
                        inputProps={{ maxLength: 20, autoComplete: 'new-password' }}
                        {...field}
                        error={!!error?.message}
                        title={error?.message}
                        helperText={error?.message}
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

export default AccountSecurityTab;
