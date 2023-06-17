import { Backdrop, Box, Button, Fade, Link, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import sendMailImg from '~/assets/images/send-confirm-mail.svg';
import classNames from 'classnames/bind';
import styles from './SendResetPasswordMailModal.module.scss';
import { Link as RouterLink } from 'react-router-dom';
import Countdown from 'react-countdown';
import { forgotPassword } from '~/services/accountService';
import { useMutation } from '@tanstack/react-query';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 350,
    maxWidth: 600,
    bgcolor: 'background.paper',
    color: 'text.primary',
    boxShadow: 24,
    outline: 'none',
    borderRadius: 2,
    p: 4,
};

function SendResetPasswordMailModal({ handleClose, email }) {
    const [dateCounter, setDateCounter] = useState(Date.now());
    const [keyCountdown, setKeyCountdown] = useState(Date.now());

    useEffect(() => {
        setDateCounter(Date.now() + HUSTConstant.WaitTime.SendActivateEmail);
        setKeyCountdown(Date.now());
    }, []);

    /**
     * Call api send mail
     */
    const { mutate: handleResend, isLoading } = useMutation(
        async () => {
            const res = await forgotPassword(email);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Resend email successfully');
                    setDateCounter(Date.now() + HUSTConstant.WaitTime.SendActivateEmail);
                    setKeyCountdown(Date.now());
                } else if (data?.Status === Enum.ServiceResultStatus.Fail && data.Message) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.TooManyRequests && data.Data > 0) {
                        setDateCounter(Date.now() + data.Data * 1000);
                        setKeyCountdown(Date.now());
                        toast.error(HUSTConstant.ToastMessage.TooManyRequestRangeTime);
                    } else {
                        toast.error(data.Message);
                    }
                }
            },
        },
    );

    const Completion = () => (
        <Link underline="always" variant="subtitle2" onClick={handleResend} sx={{ cursor: 'pointer' }}>
            Resend
        </Link>
    );

    /**
     * Render countdown
     */
    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return <Completion />;
        } else {
            let displayMinutes = minutes < 10 ? '0' + minutes : minutes,
                displaySeconds = seconds < 10 ? '0' + seconds : seconds;
            return (
                <span>
                    {displayMinutes}:{displaySeconds}
                </span>
            );
        }
    };

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open
            // onClose={handleClose}
            // closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in>
                <Box sx={style}>
                    {isLoading && <Loading />}
                    <Typography id="modal-title" variant="h6" component="h2">
                        Check password reset email
                    </Typography>
                    <div className={cx('modal-img-wrapper')}>
                        <img src={sendMailImg} alt="" className={cx('modal-img')} />
                    </div>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        An email has been sent to the supplied email address (<strong>{email}</strong>). Please follow
                        the instructions in the email to reset your password.
                    </Typography>
                    <Typography id="modal-note" sx={{ mt: 2 }} variant="body2">
                        If you do not receive the email, check your spam box. Please wait a few minutes before
                        requesting resend (<Countdown date={dateCounter} renderer={renderer} key={keyCountdown} />
                        ).
                    </Typography>
                    <Button
                        sx={{ mt: 5, textTransform: 'none' }}
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleClose}
                        component={RouterLink}
                        to="/login"
                        replace
                    >
                        Back to Log in
                    </Button>
                    <Button
                        sx={{ mt: 1, textTransform: 'none' }}
                        variant="text"
                        size="large"
                        fullWidth
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
}

export default SendResetPasswordMailModal;
