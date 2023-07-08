import { memo, useState } from 'react';
import { IconButton, Paper, Skeleton, TextField } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';

import classNames from 'classnames/bind';
import styles from './TranslationResultBox.module.scss';
import { ContentCopy } from '@mui/icons-material';
import MySnackbar from '~/components/BaseComponent/MySnackbar/MySnackbar';

const cx = classNames.bind(styles);

function TranslationResultBox({ text, isLoading, sx }) {
    const [openSnack, setOpenSnack] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setOpenSnack(true);
    };

    return (
        <>
            <MySnackbar open={openSnack} setOpen={setOpenSnack} message="Copied to clipboard!" />
            <Paper sx={{ ...stylePaper, ...sx }} className={cx('result-wrapper')}>
                {isLoading ? (
                    <>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </>
                ) : (
                    <>
                        <TextField
                            id="txtTranslation"
                            label="Translation (Vietnamese)"
                            fullWidth
                            multiline
                            maxRows={6}
                            minRows={4}
                            autoComplete="off"
                            placeholder="Translation result"
                            InputProps={{ readOnly: true }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            value={text}
                        />
                        <IconButton className={cx('btn-copy')} onClick={handleCopyToClipboard} disabled={!text}>
                            <ContentCopy />
                        </IconButton>
                    </>
                )}
            </Paper>
        </>
    );
}

export default memo(TranslationResultBox);
