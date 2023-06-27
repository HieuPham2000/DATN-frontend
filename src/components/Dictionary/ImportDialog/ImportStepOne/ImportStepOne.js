import React, { memo, useCallback, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ImportStepOne.module.scss';
import templateImg from '~/assets/images/template.svg';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { downloadTemplate, importDictionary } from '~/services/templateService';
import { useMutation } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import Loading from '~/components/Loading';
import Upload from '~/components/BaseComponent/Upload/Upload';
import { formatData } from '~/utils/common/utils';
import { Enum } from '~/utils/common/enumeration';

const cx = classNames.bind(styles);

function ImportStepOne({ onNext, setImportData, dictId }) {
    const [file, setFile] = useState(null);
    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const newFile = acceptedFiles[0];
        if (newFile) {
            setFile(
                Object.assign(newFile, {
                    preview: URL.createObjectURL(newFile),
                }),
            );
        }
    }, []);

    const handleRemoveFile = (inputFile) => {
        setFile(null);
    };

    const handleNext = () => {
        if (file == null) {
            toast.warning('File is required');
            return;
        }
        handleImport();
    };

    const { mutate: handleDownloadTemplate, isLoading: isLoadingDownload } = useMutation(
        async () => {
            const res = await downloadTemplate();
            return res;
        },
        {
            onSuccess: (data) => {
                if (data?.status === HttpStatusCode.Ok) {
                    toast.success('Download successfully');
                } else if (data?.status === HttpStatusCode.NoContent) {
                    toast.error('No data');
                } else {
                    toast.error(HUSTConstant.ToastMessage.GeneralError);
                }
            },
        },
    );

    const { mutate: handleImport, isLoading: isLoadingImport } = useMutation(
        async () => {
            const res = await importDictionary(file, dictId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    setImportData(data.Data);
                    onNext();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Upload failed');
                } else {
                    toast.error('Upload failed');
                }
            },
        },
    );

    return (
        <Box className={cx('wrapper')}>
            {(isLoadingDownload || isLoadingImport) && <Loading />}
            <div className={cx('content-header')}>
                <Typography variant="h6">Step 1: Select import file</Typography>
                <Typography>Put the data in the template file and upload</Typography>
            </div>
            <div className={cx('content-main')}>
                <div className={cx('download-template-wrapper')}>
                    <Typography
                        sx={{
                            px: 2,
                            mb: 1,
                            fontWeight: '500',
                        }}
                    >
                        Download template file
                    </Typography>
                    <Paper
                        sx={{
                            ...stylePaper,
                            px: 2,
                            pb: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 4,
                        }}
                    >
                        <img src={templateImg} alt="Template" className={cx('img-download-template')}></img>
                        <Typography>
                            The excel template file containing pre-structured worksheets for import. You can only import
                            using this template file.
                        </Typography>
                        <Button
                            sx={{ mt: 2, textTransform: 'none' }}
                            variant="contained"
                            onClick={handleDownloadTemplate}
                        >
                            Download template
                        </Button>
                    </Paper>
                </div>
                <div className={cx('attach-wrapper')}>
                    <div className={cx('attach-header')}>
                        <Typography
                            sx={{
                                mb: 1,
                                fontWeight: '500',
                            }}
                        >
                            Attach file
                        </Typography>
                        <Typography
                            sx={{
                                mb: 1,
                                fontSize: '1.2rem',
                                fontStyle: 'italic',
                            }}
                            color="text.secondary"
                        >
                            Allowed .xlsx max size of {formatData(HUSTConstant.MaxFileSize.Import)}
                        </Typography>
                    </div>

                    <Paper
                        sx={{
                            ...stylePaper,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 4,
                        }}
                    >
                        <Upload
                            file={file}
                            accept={{ [HUSTConstant.FileContentType.Excel2007]: [] }}
                            // thumbnail
                            maxSize={HUSTConstant.MaxFileSize.Import}
                            onDrop={handleDropSingleFile}
                            onRemove={handleRemoveFile}
                        />
                    </Paper>
                </div>
            </div>
            <div className={cx('content-footer')}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button color="inherit" variant="outlined" disabled sx={{ mr: 1, minWidth: 100 }}>
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" sx={{ minWidth: 100 }} onClick={handleNext}>
                        Next
                    </Button>
                </Box>
            </div>
        </Box>
    );
}

export default memo(ImportStepOne);
