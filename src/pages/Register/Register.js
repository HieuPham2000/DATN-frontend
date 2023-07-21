import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, TextField } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import classNames from 'classnames/bind';

import { useDarkMode } from '~/stores';
import yup from '~/utils/common/validate/yupGlobal';
import ToggleMode from '~/components/ToggleDarkMode';
import PasswordTextField from '~/components/BaseComponent/PasswordTextField';
import Loading from '~/components/Loading';

import registerImg from '~/assets/images/register-img.svg';
import logoImg from '~/assets/logos/logo-with-text.png';
import styles from './Register.module.scss';
import { useMutation } from '@tanstack/react-query';
import { register } from '~/services/accountService';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import SendConfirmMailModal from '~/components/SendConfirmMailModal';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email(),
    password: yup.string().required('Password is required.').password(),
    confirmPassword: yup
        .string()
        .required('Confirm password is required.')
        .test('match-password', "Password don't match.", (value, context) => value === context.parent.password),
});

function Register() {
    const isDarkMode = useDarkMode((state) => state.enabledState);
    const [errorServer, setErrorServer] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(schema),
    });
    const email = useWatch({
        control,
        name: 'email',
    });
    const password = useWatch({
        control,
        name: 'password',
    });

    /**
     * Reset thông báo lỗi từ server
     */
    useEffect(() => {
        if (errorServer) {
            setErrorServer('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    /**
     * Call api register
     */
    const { mutate: handleRegister, isLoading } = useMutation(
        async (data) => {
            const res = await register(data.email, data.password);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Successful account registration');
                    setOpenModal(true);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err1001) {
                        toast.warning(data.Message);
                    } else {
                        toast.error(data.Message);
                    }

                    setErrorServer(data.Message);
                }
            },
        },
    );

    /**
     * Xử lý submit khi Enter
     */
    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit(handleRegister)();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Register | HUST PVO</title>
            </Helmet>
            {isLoading && <Loading />}
            {openModal && (
                <SendConfirmMailModal handleClose={() => setOpenModal(false)} email={email} password={password} />
            )}

            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('left-wrapper', isDarkMode && 'dark-mode')}>
                <img className={cx('logo-img')} src={logoImg} alt="" />
                <Typography variant="h4" className={cx('title-info')}>
                    Organize your vocabulary
                    <br />
                    in a personalized way with HUST PVO
                </Typography>
                <img className={cx('bg-img')} src={registerImg} alt="Register" />
                <Typography variant="body2" m={2}>
                    For educational purposes only
                </Typography>
            </div>
            <div className={cx('right-wrapper')}>
                <Typography variant="h4" mb={2}>
                    Get started absolutely free
                </Typography>
                <div className={cx('register-wrapper')}>
                    <Typography variant="body2">Already have an account?</Typography>
                    <Link ml={0.5} underline="hover" variant="subtitle2" component={RouterLink} to="/login" replace>
                        Log in
                    </Link>
                </div>
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            id="txtEmail"
                            type="email"
                            label="Email address"
                            margin="normal"
                            fullWidth
                            inputProps={{ maxLength: 50 }}
                            {...field}
                            error={!!error?.message}
                            title={error?.message}
                            helperText={error?.message}
                        />
                    )}
                />
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

                {errorServer && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        {errorServer}
                    </Typography>
                )}
                <Button
                    sx={{ mt: 2, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit(handleRegister)}
                >
                    Create Account
                </Button>
            </div>
        </div>
    );
}

export default Register;
