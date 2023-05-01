import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, TextField } from '@mui/material';
import classNames from 'classnames/bind';
import registerImg from '~/assets/images/register-img.svg';
import logoImg from '~/assets/logos/logo-with-text.png';
import styles from './Register.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import PasswordTextField from '~/components/PasswordTextField';
import { MyValidateChain } from '~/utils/common/validate/validateChain';
import { useDarkMode } from '~/stores';

const cx = classNames.bind(styles);

function Register() {
    const isDarkMode = useDarkMode((state) => state.enabledState);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({});

    const handleLogin = () => {
        setError({
            helperText: null,
            emailError: new MyValidateChain().validateRequireField(email, 'Email').validateEmail(email).msg,
            passwordError: new MyValidateChain().validateRequireField(password, 'Password').validatePassword(password)
                .msg,
            confirmPasswordError: new MyValidateChain()
                .validateRequireField(confirmPassword, 'Confirm password')
                .validateMatchField(confirmPassword, password, 'Passwords').msg,
        });
        console.log({
            email,
            password,
            confirmPassword,
        });
    };

    const handleChangeEmail = (newValue) => {
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Email').validateEmail(newValue);
        setError({
            ...error,
            emailError: validateRes.msg,
        });
        setEmail(newValue);
    };

    const handleChangePassword = (newValue) => {
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Password').validatePassword(password);
        setError({
            ...error,
            passwordError: validateRes.msg,
        });
        setPassword(newValue);
    };

    const handleChangeConfirmPassword = (newValue) => {
        let validateRes = new MyValidateChain()
            .validateRequireField(newValue, 'Confirm password')
            .validateMatchField(newValue, password, 'Passwords');
        setError({
            ...error,
            confirmPasswordError: validateRes.msg,
        });
        setConfirmPassword(newValue);
    };

    return (
        <div className={cx('wrapper')}>
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('left-wrapper', isDarkMode && 'dark-mode')}>
                <img className={cx('logo-img')} src={logoImg} alt="" />
                <Typography variant="h4" className={cx('title-info')}>
                    Organize your vocabulary
                    <br />
                    in a personalized way with HUST PVO
                </Typography>
                <img className={cx('bg-img')} src={registerImg} alt="" />
            </div>
            <div className={cx('right-wrapper')}>
                <Typography variant="h4" mb={2}>
                    Get started absolutely free
                </Typography>
                <div className={cx('register-wrapper')}>
                    <Typography variant="body2">Already have an account?</Typography>
                    <Link ml={0.5} underline="hover" variant="subtitle2" component={RouterLink} to="/login">
                        Log in
                    </Link>
                </div>
                <TextField
                    id="txtEmail"
                    type="email"
                    label="Email address"
                    margin="normal"
                    fullWidth
                    value={email}
                    error={!!error.emailError}
                    title={error.emailError}
                    helperText={error.emailError}
                    onChange={(e) => handleChangeEmail(e.target.value)}
                />
                <PasswordTextField
                    id="txtPassword"
                    label="Password"
                    value={password}
                    error={!!error.passwordError}
                    title={error.passwordError}
                    helperText={error.passwordError}
                    onChange={(e) => handleChangePassword(e.target.value)}
                />
                <PasswordTextField
                    id="txtRePassword"
                    label="Confirm password"
                    value={confirmPassword}
                    error={!!error.confirmPasswordError}
                    title={error.confirmPasswordError}
                    helperText={error.confirmPasswordError}
                    onChange={(e) => handleChangeConfirmPassword(e.target.value)}
                />
                {error.helperText && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        {error.helperText}
                    </Typography>
                )}
                <Button
                    sx={{ mt: 2, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleLogin}
                >
                    Create Account
                </Button>
            </div>
        </div>
    );
}

export default Register;
