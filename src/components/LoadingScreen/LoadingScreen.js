import classNames from 'classnames/bind';
import styles from './LoadingScreen.module.scss';
import { Box, Fade, LinearProgress, Typography } from '@mui/material';

const cx = classNames.bind(styles);
function LoadingScreen({ text, dense }) {
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
                    <div className={cx('progress')}>
                        <LinearProgress color="success" />
                    </div>
                </div>
            </div>
        </Fade>
    );
}

export default LoadingScreen;
