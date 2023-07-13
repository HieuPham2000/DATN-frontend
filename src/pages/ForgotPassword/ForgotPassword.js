import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Typography, TextField } from '@mui/material';
import classNames from 'classnames/bind';
import forgotPwImg from '~/assets/images/forgot-pw.svg';
import styles from './ForgotPassword.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import yup from '~/utils/common/validate/yupGlobal';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPassword } from '~/services/accountService';
import { useMutation } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import HUSTConstant from '~/utils/common/constant';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading';
import SendResetPasswordMailModal from '~/components/SendResetPasswordMailModal';
import Countdown from 'react-countdown';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email(),
});

function ForgotPassword() {
    const location = useLocation();

    const [errorServer, setErrorServer] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isDisableBtn, setDisableBtn] = useState(false);
    const [dateCounter, setDateCounter] = useState(Date.now());
    const [keyCountdown, setKeyCountdown] = useState(Date.now());

    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: location?.state?.email || '',
        },
        resolver: yupResolver(schema),
    });
    const email = useWatch({
        control,
        name: 'email',
    });

    /**
     * Reset thông báo lỗi từ server
     */
    useEffect(() => {
        if (errorServer) {
            setErrorServer('');
        }

        if (dateCounter > Date.now()) {
            setDateCounter(Date.now());
            setKeyCountdown(Date.now());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    /**
     * Call api
     */
    const { mutate: handleSendRequest, isLoading } = useMutation(
        async () => {
            const res = await forgotPassword(email);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    setOpenModal(true);
                    // setDateCounter(Date.now());
                    // setKeyCountdown(Date.now());
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.TooManyRequests) {
                        toast.error(HUSTConstant.ToastMessage.TooManyRequestRangeTime);
                        setDateCounter(Date.now() + data.Data * 1000);
                        setKeyCountdown(Date.now());
                    } else {
                        toast.error(data.Message);
                        setErrorServer(data.Message);
                        // setDateCounter(Date.now());
                        // setKeyCountdown(Date.now());
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
                    Try again in {displayMinutes}:{displaySeconds}
                </span>
            );
        }
    };

    /**
     * Xử lý sự kiện click send mail (có validate trước khi call api)
     */
    const handleBeforeSendMail = () => {
        if (dateCounter > Date.now()) {
            toast.error(HUSTConstant.ToastMessage.TooManyRequestRangeTime);
        } else {
            handleSendRequest();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Forgot Password | HUST PVO</title>
            </Helmet>
            {isLoading && <Loading />}

            {openModal && <SendResetPasswordMailModal handleClose={() => setOpenModal(false)} email={email} />}

            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                <img src={forgotPwImg} alt="" className={cx('form-img')} />
                <Typography variant="h3" textAlign="center" mb={2}>
                    Forgot your password?
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    Please enter the email address associated with your account. We will email you a link to reset your
                    password.
                </Typography>
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
                            {...field}
                            error={!!error?.message}
                            title={error?.message}
                            helperText={error?.message}
                        />
                    )}
                />
                {errorServer && (
                    <Typography variant="body2" color="error.main" mb={1}>
                        {errorServer}
                    </Typography>
                )}

                <Typography variant="body2" color="error.main" mb={1}>
                    <Countdown
                        date={dateCounter}
                        renderer={renderer}
                        key={keyCountdown}
                        onStart={() => setDisableBtn(true)}
                        onComplete={() => setDisableBtn(false)}
                    />
                </Typography>

                <Button
                    sx={{ mt: 1, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit(handleBeforeSendMail)}
                    disabled={isDisableBtn}
                >
                    Send request
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
            </div>
        </div>
    );
}

export default ForgotPassword;
