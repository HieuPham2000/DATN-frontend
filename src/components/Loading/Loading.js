import classNames from 'classnames/bind';
import styles from './Loading.module.scss';
// import icon from '~/assets/images/loading.svg';
import { Box, CircularProgress, Fade, Typography } from '@mui/material';

const cx = classNames.bind(styles);
function Loading({ text, dense }) {
    return (
        <Fade in>
            <div className={cx('wrapper')}>
                <Box
                    sx={{
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        opacity: dense ? 1 : 0.7,
                    }}
                    className={cx('background')}
                ></Box>
                <div className={cx('content')}>
                    {!!text && (
                        <Typography variant="subtitle" mb={1}>
                            {text}
                        </Typography>
                    )}
                    <div className={cx('spinner')}>
                        <CircularProgress />
                        {/* <object data={icon} aria-label="loading-icon"></object> */}
                    </div>
                </div>
            </div>
        </Fade>
    );
}

export default Loading;
