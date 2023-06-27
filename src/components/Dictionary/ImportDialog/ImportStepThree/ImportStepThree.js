import React, { memo, useMemo } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ImportStepThree.module.scss';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { formatNumber } from '~/utils/common/utils';
import { CheckCircle } from '@mui/icons-material';
import successImg from '~/assets/images/success_import.svg';
const cx = classNames.bind(styles);

function ImportStepThree({ onFinish, dictId, importData, numberSuccessRecord }) {
    const textSuccessRecord = useMemo(() => {
        let num = formatNumber(numberSuccessRecord ?? 0);
        return num > 1 ? num + ' successful import records' : num + ' successful import record';
    }, [numberSuccessRecord]);

    const handleFinish = () => {
        onFinish();
    };

    return (
        <Box className={cx('wrapper')}>
            <div className={cx('content-header')}>
                <Typography variant="h6">Step 3: View import result</Typography>
            </div>
            <div className={cx('content-main')}>
                <div className={cx('left-wrapper')}>
                    <Paper
                        sx={{
                            ...stylePaper,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 4,
                        }}
                    >
                        <img src={successImg} alt="Import successfully" className={cx('img-success')} />
                        <Box className={cx('text-num-record')} color="primary.main">
                            <CheckCircle />
                            <Typography ml={1} fontSize="1.5rem" fontWeight="500">
                                {textSuccessRecord}
                            </Typography>
                        </Box>
                    </Paper>
                </div>
            </div>
            <div className={cx('content-footer')}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleFinish} variant="contained" sx={{ minWidth: 100 }}>
                        Finish
                    </Button>
                </Box>
            </div>
        </Box>
    );
}

export default memo(ImportStepThree);
