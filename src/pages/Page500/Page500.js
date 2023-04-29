import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import classNames from 'classnames/bind';
import pageImg from '~/assets/images/page500.svg';
import styles from './Page500.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';

const cx = classNames.bind(styles);

function Page500() {
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
                <Typography variant="h3" textAlign="center" mb={2}>
                    500 Internal Server Error
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
                    There was an error, please try again later.
                </Typography>
                <img src={pageImg} alt="" className={cx('form-img')} />
                <Button
                    sx={{ mt: 5, textTransform: 'none' }}
                    variant="contained"
                    size="large"
                    fullWidth
                    component={RouterLink}
                    to="/login"
                >
                    Back to Home
                </Button>
            </div>
        </Box>
    );
}

export default Page500;
