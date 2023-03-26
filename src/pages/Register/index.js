import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { InputAdornment, IconButton, Button, Link, Typography, TextField, Box, useTheme } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import classNames from 'classnames/bind';
import { ThemeName } from '~/scripts/common/constant';
import registerImg from '~/assets/images/register-img.svg';
import styles from './Register.module.scss';
import ToggleMode from '~/components/ToggleMode';
import { MyValidateChain } from '~/scripts/common/validate-form';

const cx = classNames.bind(styles);

function Register() {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [error, setError] = useState({});

    const handleLogin = () => {
        setError({
            helperText: null,
            emailError: new MyValidateChain().validateRequireField(email, "Email").validateEmail(email).msg,
            passwordError: new MyValidateChain().validateRequireField(password, "Password").validatePassword(password).msg,
            rePasswordError: new MyValidateChain().validateRequireField(rePassword, "Confirm password").validateMatchField(rePassword, password, "Passwords").msg,
        });
        console.log({
            email,
            password,
            rePassword,
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
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Password').validatePassword(password);
        setError({
            ...error,
            passwordError: validateRes.msg,
        });
        setPassword(newValue);
    };

    /**
     * Xử lý error + set state re-password
     * @param {string} newValue
     */
    const handleSetRePassword = (newValue) => {
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Confirm password').validateMatchField(newValue, password, "Passwords");
        setError({
            ...error,
            rePasswordError: validateRes.msg,
        });
        setRePassword(newValue);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((show) => !show);

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
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
            <div className={cx('left-wrapper', theme.palette.mode === ThemeName.Dark && 'dark-mode')}>
                <Typography variant="h3" className={cx('title-info')}>
                    Organize your vocabulary
                    <br />
                    in a personalized way with PVO
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
                        Sign in
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
                <TextField
                    id="txtPassword"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    margin="normal"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility fontSize="small" />
                                    ) : (
                                        <VisibilityOff fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={password}
                    error={!!error.passwordError}
                    title={error.passwordError}
                    helperText={error.passwordError}
                    onChange={(e) => handleSetPassword(e.target.value)}
                />
                <TextField
                    id="txtRePassword"
                    type={showRePassword ? 'text' : 'password'}
                    label="Confirm password"
                    margin="normal"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle re-password visibility"
                                    onClick={handleClickShowRePassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showRePassword ? (
                                        <Visibility fontSize="small" />
                                    ) : (
                                        <VisibilityOff fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={rePassword}
                    error={!!error.rePasswordError}
                    title={error.rePasswordError}
                    helperText={error.rePasswordError}
                    onChange={(e) => handleSetRePassword(e.target.value)}
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
        </Box>
    );
}

export default Register;
