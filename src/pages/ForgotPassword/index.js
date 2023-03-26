import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Typography, TextField, Box } from '@mui/material';
import classNames from 'classnames/bind';
import forgotPwImg from '~/assets/images/forgot-pw.svg';
import styles from './ForgotPassword.module.scss';
import ToggleMode from '~/components/ToggleMode';
import { MyValidateChain } from '~/scripts/common/validate-form';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const location = useLocation();
    const [email, setEmail] = useState(location?.state.email || '');
    const [error, setError] = useState({});

    const handleSendRequest = () => {
        setError({
            helperText: null,
            emailError: new MyValidateChain().validateRequireField(email, "Email").validateEmail(email).msg,
        });
        console.log({
            email,
        });
    };

    /**
     * Xử lý error + set state email
     * @param {string} newValue
     */
    const handleSetEmail = (newValue) => {
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Email').validateEmail(newValue);
        setError({
            ...error,
            emailError: validateRes.msg,
        });
        setEmail(newValue);
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
            }}
            className={cx('wrapper')}
        >
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                <img src={forgotPwImg} alt="" className={cx('form-img')} />
                <Typography variant="h3" mb={2}>
                    Forgot your password?
                </Typography>
                <div className={cx('register-wrapper')}>
                    <Typography variant="body1" color="text.secondary">
                        Please enter the email address associated with your account. We will email you a link to reset
                        your password.
                    </Typography>
                </div>
                <TextField
                    id="txtEmail"
                    type="email"
                    label="Email address"
                    margin="normal"
                    fullWidth
                    value={email}
                    error={!!error.emailError}
                    helperText={error.emailError}
                    title={error.emailError}
                    onChange={(e) => handleSetEmail(e.target.value)}
                />
                {error.helperText && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        {error.helperText}
                    </Typography>
                )}

                <Button
                    sx={{ mt: 1, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSendRequest}
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
                >
                    Back to Sign in
                </Button>
            </div>
        </Box>
    );
}

export default ForgotPassword;
