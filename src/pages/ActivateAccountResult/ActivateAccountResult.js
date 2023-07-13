import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import successImg from '~/assets/images/success.svg';
import warnImg from '~/assets/images/warning.svg';
import styles from './ActivateAccountResult.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import { useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';
import { useMutation } from '@tanstack/react-query';
import { activateAccount } from '~/services/accountService';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

function ActivateAccountResult() {
    const { token } = useParams();
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(false);

    /**
     * Call api activate account
     */
    const { mutate: handleActivateAccount, isLoading } = useMutation(
        async () => {
            const res = await activateAccount(token);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success(data.Message);
                    setMsg(data.Message);
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
        handleActivateAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Activate Account | HUST PVO</title>
            </Helmet>
            {isLoading && <Loading text="Wait for activate your account" dense />}
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                <img
                    src={error ? warnImg : successImg}
                    alt={error ? 'Warning' : 'Success'}
                    className={cx('form-img')}
                />
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
            </div>
        </div>
    );
}

export default ActivateAccountResult;
