import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Link, Typography, TextField } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import classNames from 'classnames/bind';

import ToggleMode from '~/components/ToggleDarkMode';
import PasswordTextField from '~/components/PasswordTextField';
import { useDarkMode } from '~/stores';
import yup from '~/utils/common/validate/yupGlobal';

import loginImg from '~/assets/images/login-img.svg';
import logoImg from '~/assets/logos/logo-with-text.png';
import styles from './Login.module.scss';
import { useMutation } from '@tanstack/react-query';
import { login, sendActivateEmail } from '~/services/accountService';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';
import HUSTConstant from '~/utils/common/constant';
import { toast } from 'react-toastify';
import SendConfirmMailModal from '~/components/SendConfirmMailModal/SendConfirmMailModal';
import Countdown from 'react-countdown';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email(),
    password: yup.string().required('Password is required.'),
});

function Login() {
    const navigate = useNavigate();
    const isDarkMode = useDarkMode((state) => state.enabledState);

    const [errorServer, setErrorServer] = useState('');
    const [isUnactivatedAccount, setUnactivatedAccount] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dateCounter, setDateCounter] = useState(Date.now());
    const [keyCountdown, setKeyCountdown] = useState(Date.now());

    const {
        handleSubmit,
        control,
        // formState: { errors },
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
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
        setUnactivatedAccount(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, password]);

    /**
     * Call api register
     */
    const { mutate: handleLogin, isLoading } = useMutation(
        async (data) => {
            const res = await login(data.email, data.password);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    navigate('/', { replace: true });
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    // Chưa kích hoạt tài khoản
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err1004) {
                        setUnactivatedAccount(true);
                        setDateCounter(Date.now());
                        setKeyCountdown(Date.now());
                    } else {
                        toast.error(data.Message);
                        setErrorServer(data.Message);
                    }
                }
            },
        },
    );

    /**
     * Call api send email activate
     */
    const { mutate: handleSendMail, isLoading: isLoadingSendMail } = useMutation(
        async () => {
            const res = await sendActivateEmail(email, password);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Send email successfully');
                    setOpenModal(true);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.TooManyRequests && data.Data > 0) {
                        toast.error(HUSTConstant.ToastMessage.TooManyRequestRangeTime);
                        setDateCounter(Date.now() + data.Data * 1000);
                        setKeyCountdown(Date.now());
                    } else {
                        toast.error(data.Message);
                    }
                }
            },
        },
    );

    /**
     * Render countdown
     */
    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return <span></span>;
        } else {
            let displayMinutes = minutes < 10 ? '0' + minutes : minutes,
                displaySeconds = seconds < 10 ? '0' + seconds : seconds;
            return (
                <span>
                    (Try again in {displayMinutes}:{displaySeconds})
                </span>
            );
        }
    };

    /**
     * Xử lý sự kiện click send mail (có validate trước khi call api)
     */
    const handleBeforeSendMail = () => {
        if (dateCounter > Date.now()) {
            toast.warning(HUSTConstant.ToastMessage.TooManyRequestRangeTime);
        } else {
            handleSendMail();
        }
    };

    return (
        <div className={cx('wrapper')}>
            {(isLoading || isLoadingSendMail) && <Loading />}
            {openModal && <SendConfirmMailModal open={openModal} email={email} password={password} />}

            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('left-wrapper', isDarkMode && 'dark-mode')}>
                <img className={cx('logo-img')} src={logoImg} alt="" />
                <Typography variant="h4" m={2}>
                    Hi, welcome back!
                </Typography>
                <img className={cx('bg-img')} src={loginImg} alt="" />
            </div>
            <div className={cx('right-wrapper')}>
                <Typography variant="h4" mb={2}>
                    Log in to HUST PVO
                </Typography>
                <div className={cx('register-wrapper')}>
                    <Typography variant="body2">New user?</Typography>
                    <Link ml={0.5} underline="hover" variant="subtitle2" component={RouterLink} to="/register">
                        Create an account
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

                {errorServer && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        {errorServer}
                    </Typography>
                )}

                {isUnactivatedAccount && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        <span>Unactivated account! </span>
                        <Link
                            underline="hover"
                            variant="body2"
                            color="inherit"
                            sx={{ cursor: 'pointer', fontStyle: 'italic' }}
                            onClick={handleBeforeSendMail}
                        >
                            Click here
                        </Link>
                        <span>
                            {' '}
                            to receive an account activation email.{' '}
                            <Countdown date={dateCounter} renderer={renderer} key={keyCountdown} />
                        </span>
                    </Typography>
                )}

                <div className={cx('option-wrapper')}>
                    {/* <FormControlLabel 
                        control={<Checkbox />} 
                        label={<Typography variant='body2'>Remember me</Typography>}
                        checked={isRemember}
                        onChange={() => setRemember(!isRemember)}
                    /> */}
                    <div></div>
                    <Link
                        underline="always"
                        variant="body2"
                        color="inherit"
                        margin={1}
                        component={RouterLink}
                        to="/forgot-password"
                        state={{ email }}
                    >
                        Forgot password?
                    </Link>
                </div>
                <Button
                    sx={{ mt: 1, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit(handleLogin)}
                >
                    Log in
                </Button>
            </div>
        </div>
    );
}

export default Login;
