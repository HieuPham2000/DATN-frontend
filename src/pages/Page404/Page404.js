import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import page404Img from '~/assets/images/page404.svg';
import styles from './Page404.module.scss';
import ToggleMode from '~/components/ToggleDarkMode';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

function Page404() {
    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Page not found | HUST PVO</title>
            </Helmet>
            <ToggleMode className={cx('btn-toggle-mode')} />
            <div className={cx('form-wrapper')}>
                <Typography variant="h3" textAlign="center" mb={2}>
                    Sorry, page not found!
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
                    Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to
                    check your spelling.
                </Typography>
                <img src={page404Img} alt="" className={cx('form-img')} />
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

export default Page404;
