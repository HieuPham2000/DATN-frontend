import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import classNames from 'classnames/bind';

import { useDarkMode } from '~/stores';
import yup from '~/utils/common/validate/yupGlobal';
import ToggleMode from '~/components/ToggleDarkMode';
import PasswordTextField from '~/components/PasswordTextField';
import registerImg from '~/assets/images/register-img.svg';
import logoImg from '~/assets/logos/logo-with-text.png';
import styles from './Register.module.scss';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email(),
    password: yup.string().required('Password is required.').password(),
    confirmPassword: yup
        .string()
        .required('Confirm password is required.')
        .test('match-password', "Password don't match.", (value, context) => value === context.parent.password),
});

function Register() {
    const isDarkMode = useDarkMode((state) => state.enabledState);
    const [errorServer, setErrorServer] = useState('');
    const {
        handleSubmit,
        control,
        // formState: { errors },
    } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(schema),
    });

    const handleRegister = (data) => {
        console.log(data);
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
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <PasswordTextField
                            id="txtPassword"
                            label="Password"
                            {...field}
                            error={!!error?.message}
                            title={error?.message}
                            helperText={error?.message}
                        />
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <PasswordTextField
                            id="txtConfirmPassword"
                            label="Confirm password"
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
                <Button
                    sx={{ mt: 2, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit(handleRegister)}
                >
                    Create Account
                </Button>
            </div>
        </div>
    );
}

export default Register;
