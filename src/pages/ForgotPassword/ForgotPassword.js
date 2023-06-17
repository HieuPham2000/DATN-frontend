import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Typography, TextField } from '@mui/material';
import classNames from 'classnames/bind';
import forgotPwImg from '~/assets/images/forgot-pw.svg';
import styles from './ForgotPassword.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import yup from '~/utils/common/validate/yupGlobal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
    email: yup.string().required('Email is required.').email(),
});

function ForgotPassword() {
    const location = useLocation();
    const [errorServer, setErrorServer] = useState('');
    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            email: location?.state?.email || '',
        },
        resolver: yupResolver(schema),
    });

    const handleSendRequest = (data) => {
        console.log(data);
    };

    return (
        <div className={cx('wrapper')}>
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
                    <Typography variant="body2" color="error.main" mt={1}>
                        {errorServer}
                    </Typography>
                )}

                <Button
                    sx={{ mt: 1, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit(handleSendRequest)}
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
                    Back to Log in
                </Button>
            </div>
        </div>
    );
}

export default ForgotPassword;
