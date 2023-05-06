import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import successImg from '~/assets/images/success.svg';
import warnImg from '~/assets/images/warning.svg';
import styles from './ActivateAccountResult.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import { useEffect, useState } from 'react';
import httpRequest from '~/utils/httpRequest';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';

const cx = classNames.bind(styles);

function ActivateAccountResult() {
    const { token } = useParams();
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let handleActivateAccount = async () => {
            try {
                let param = {
                    params: {
                        token: token,
                    },
                };
                let res = await httpRequest.get('account/activate_account', param);
                let data = res.data;
                if (data && data.Status === Enum.ServiceResultStatus.Success) {
                    setMsg(res.data.Message);
                    setError(false);
                } else if (data && data.Status === Enum.ServiceResultStatus.Fail) {
                    setMsg(res.data.Message);
                    setError(true);
                } else {
                    setMsg('An error has occurred');
                    setError(true);
                }
            } catch (err) {
                setMsg('An error has occurred');
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        handleActivateAccount();
    }, [token]);

    return (
        <div className={cx('wrapper')}>
            {loading && <Loading text="Wait for activate your account" dense />}
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                <img src={error ? warnImg : successImg} alt={error ? "Warning" : "Success"} className={cx('form-img')} />
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
                    {msg}
                </Typography>
                <Button
                    sx={{ mt: 5, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    component={RouterLink}
                    to="/"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
}

export default ActivateAccountResult;
