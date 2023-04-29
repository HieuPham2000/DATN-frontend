import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { InputAdornment, IconButton, Button, Link, Typography, TextField, Box, useTheme } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import classNames from 'classnames/bind';
import { ThemeName } from '~/scripts/common/constant';
import loginImg from '~/assets/images/login-img.svg';
import styles from './Login.module.scss';
import ToggleMode from '~/components/ToggleMode';
import { MyValidateChain } from '~/scripts/common/validate-form';

const cx = classNames.bind(styles);

function Login() {
    // const [isRemember, setRemember] = useState(false);
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        let validateRes = new MyValidateChain().validateRequireField(newValue, 'Password');
        setError({
            ...error,
            passwordError: validateRes.msg,
        });
        setPassword(newValue);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

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
                <Typography variant="h3" m={2}>
                    Hi, welcome back!
                </Typography>
                <img className={cx('bg-img')} src={loginImg} alt="" />
            </div>
            <div className={cx('right-wrapper')}>
                <Typography variant="h4" mb={2}>
                    Log in to PVO
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
                    Login
                </Button>
            </div>
        </Box>
    );
}

export default Login;
