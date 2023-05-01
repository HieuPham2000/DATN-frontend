import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, TextField } from '@mui/material';
import classNames from 'classnames/bind';

import loginImg from '~/assets/images/login-img.svg';
import logoImg from '~/assets/logos/logo-with-text.png';
import styles from './Login.module.scss';
import { MyValidateChain } from '~/utils/common/validate/validateChain';
import { useDarkMode } from '~/stores';
import ToggleMode from '~/components/ToggleDarkMode';
import PasswordTextField from '~/components/PasswordTextField';

const cx = classNames.bind(styles);

function Login() {
    const isDarkMode = useDarkMode((state) => state.enabledState);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});

    const handleLogin = () => {
        setError({
            helperText: null,
            emailError: new MyValidateChain().validateRequireField(email, 'Email').validateEmail(email).msg,
            passwordError: new MyValidateChain().validateRequireField(password, 'Password').msg,
        });
        console.log({
            email,
            password,
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

    /**
     * Xử lý error + set state password
     * @param {string} newValue
     */
    const handleSetPassword = (newValue) => {
        setPassword(newValue);
    };

    return (
        <div className={cx('wrapper')}>
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
                    onChange={(e) => handleSetEmail(e.target.value)}
                />
                <PasswordTextField
                    id="txtPassword"
                    label="Password"
                    value={password}
                    // error={!!error.passwordError}
                    // title={error.passwordError}
                    // helperText={error.passwordError}
                    validateRules={['required', 'password']}
                    onChange={(e) => handleSetPassword(e.target.value)}
                />
                {error.helperText && (
                    <Typography variant="body2" color="error.main" mt={1}>
                        {error.helperText}
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
                    onClick={handleLogin}
                >
                    Log in
                </Button>
            </div>
        </div>
    );
}

export default Login;
