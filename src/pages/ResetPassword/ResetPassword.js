import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import resetPwImg from '~/assets/images/reset-password.svg';
import warnImg from '~/assets/images/warning.svg';
import styles from './ResetPassword.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import { useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';
import { useMutation } from '@tanstack/react-query';
import { checkAccessResetPassword, resetPassword } from '~/services/accountService';
import { toast } from 'react-toastify';
import { Controller, useForm, useWatch } from 'react-hook-form';
import PasswordTextField from '~/components/BaseComponent/PasswordTextField';
import yup from '~/utils/common/validate/yupGlobal';
import { yupResolver } from '@hookform/resolvers/yup';
import HUSTConstant from '~/utils/common/constant';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    password: yup.string().required('Password is required.').password(),
    confirmPassword: yup
        .string()
        .required('Confirm password is required.')
        .test('match-password', "Password don't match.", (value, context) => value === context.parent.password),
});

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(false);

    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(schema),
    });
    const password = useWatch({
        control,
        name: 'password',
    });

    /**
     * Call api
     */
    const { mutate: checkAccess, isLoading } = useMutation(
        async () => {
            const res = await checkAccessResetPassword(token);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success(data.Message);
                    setError(false);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    toast.error(data.Message);
                    setMsg(data.Message);
                    setError(true);
                } else {
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                    setMsg(HUSTConstant.ToastMessage.GeneralError);
                    setError(true);
                }
            },
            onError: (err) => {
                setMsg(HUSTConstant.ToastMessage.GeneralError);
                setError(true);
            },
        },
    );

    useEffect(() => {
        checkAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Call api
     */
    const { mutate: handleUpdatePassword, isLoading: isLoadingUpdate } = useMutation(
        async () => {
            const res = await resetPassword(token, password);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Password updated successfully');
                    navigate('/login', { replace: true });
                    setError(false);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    toast.error(data.Message);
                    setMsg(data.Message);
                    setError(true);
                } else {
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                    setMsg(HUSTConstant.ToastMessage.GeneralError);
                    setError(true);
                }
            },
            onError: (err) => {
                setMsg(HUSTConstant.ToastMessage.GeneralError);
                setError(true);
            },
        },
    );

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Reset Password | HUST PVO</title>
            </Helmet>
            {isLoading && <Loading text="Wait for the server to check the token" dense />}
            {isLoadingUpdate && <Loading />}
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                {error && (
                    <>
                        <img src={warnImg} alt={'Warning'} className={cx('form-img')} />
                        <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
                            {msg}
                        </Typography>
                        <Button
                            sx={{ mt: 5, textTransform: 'none' }}
                            variant="contained"
                            size="large"
                            fullWidth
                            component={RouterLink}
                            to="/login"
                            replace
                        >
                            Back to Log in
                        </Button>
                    </>
                )}
                {!error && (
                    <>
                        <img src={resetPwImg} alt={'Success'} className={cx('form-img')} />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <PasswordTextField
                                    id="txtPassword"
                                    label="Password"
                                    inputProps={{ maxLength: 20 }}
                                    {...field}
                                    error={!!error?.message}
                                    title={error?.message}
                                    helperText={error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <PasswordTextField
                                    id="txtConfirmPassword"
                                    label="Confirm password"
                                    inputProps={{ maxLength: 20 }}
                                    {...field}
                                    error={!!error?.message}
                                    title={error?.message}
                                    helperText={error?.message}
                                />
                            )}
                        />
                        <Button
                            sx={{ mt: 1, textTransform: 'none' }}
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleSubmit(handleUpdatePassword)}
                        >
                            Update password
                        </Button>
                        <Button
                            sx={{ mt: 1, textTransform: 'none' }}
                            variant="text"
                            size="large"
                            fullWidth
                            component={RouterLink}
                            to="/login"
                            replace
                        >
                            Back to Log in
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
