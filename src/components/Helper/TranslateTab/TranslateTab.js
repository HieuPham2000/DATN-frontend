import classNames from 'classnames/bind';
import styles from './TranslateTab.module.scss';
import { Box, CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { memo, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { VolumeUp } from '@mui/icons-material';
import { textToSpeech, translate } from '~/services/helperService';
import { formatNumber } from '~/utils/common/utils';
import { HttpStatusCode } from 'axios';
import TranslationResultBox from '~/components/Helper/TranslateTab/TranslationResultBox';

const cx = classNames.bind(styles);

function TranslateTab() {
    // ======================================================================
    const [translation, setTranslation] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const { handleSubmit, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            text: '',
        },
    });

    const text = useWatch({
        control,
        name: 'text',
    });

    const playAudio = (url) => {
        if (url) {
            new Audio(url).play();
        }
    };

    useEffect(() => {
        setAudioUrl(null);
        setTranslation('');
    }, [text]);
    // =======================================================================

    const { mutate: doTranslate, isLoading: isLoadingTranslate } = useMutation(
        async (data) => {
            const res = await translate(data.text);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success && data.Data.StatusCode === HttpStatusCode.Ok) {
                    setTranslation(data.Data.Content);
                } else {
                    toast.error('Translate failed');
                }
            },
        },
    );

    const { mutate: getTTS, isLoading: isLoadingTTS } = useMutation(
        async (data) => {
            const res = await textToSpeech(data.text);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success && data.Data.Base64Data) {
                    let base64Url = `data:${data.Data.ContentType};base64,${data.Data.Base64Data}`;
                    setAudioUrl(base64Url);
                    playAudio(base64Url);
                } else {
                    toast.error('Play audio failed');
                }
            },
        },
    );

    // ====================================================================

    const handleClickTranslate = () => {
        if (!translation) {
            handleSubmit(doTranslate)();
        }
    };

    const handleClickPlayAudio = () => {
        if (audioUrl) {
            playAudio(audioUrl);
        } else {
            handleSubmit(getTTS)();
        }
    };

    // ==============================================================

    return (
        <div className={cx('wrapper')}>
            <Paper sx={{ ...stylePaper, p: 2, pb: 0, m: 1 }} className={cx('source-wrapper')}>
                <Controller
                    name="text"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="txtSource"
                            label="Source text (English)"
                            fullWidth
                            multiline
                            maxRows={6}
                            minRows={4}
                            inputProps={{ maxLength: 1000 }}
                            autoComplete="off"
                            placeholder="Enter source text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...field}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            autoFocus
                        />
                    )}
                />
                <div className={cx('toolbar')}>
                    {isLoadingTTS ? (
                        <Box sx={{ p: 0.5 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <IconButton onClick={handleClickPlayAudio} disabled={!text}>
                            <VolumeUp />
                        </IconButton>
                    )}

                    <div className={cx('flex-space')}></div>
                    <Typography variant="body2" color="text.secondary">
                        {formatNumber(text.length)}/{formatNumber(1000)}
                    </Typography>
                </div>
            </Paper>
            <div className={cx('action-wrapper')}>
                <LoadingButton
                    sx={{ display: 'inline-block', minWidth: 100 }}
                    variant="contained"
                    onClick={handleClickTranslate}
                    loading={isLoadingTranslate}
                    disabled={!text}
                >
                    Translate
                </LoadingButton>
            </div>
            <TranslationResultBox isLoading={isLoadingTranslate} text={translation} sx={{ p: 2, m: 1 }} />
        </div>
    );
}

export default memo(TranslateTab);
