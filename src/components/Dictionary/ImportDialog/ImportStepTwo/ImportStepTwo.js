import React, { memo, useMemo, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './ImportStepTwo.module.scss';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { doImport } from '~/services/templateService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import Loading from '~/components/Loading';
import { formatNumber } from '~/utils/common/utils';
import { CheckCircle, Download, Error } from '@mui/icons-material';
import emptyImg from '~/assets/images/no-error.svg';
import { Enum } from '~/utils/common/enumeration';
import { getNumberRecord } from '~/services/dictionaryService';
import AlertDialog from '~/components/BaseComponent/AlertDialog/AlertDialog';
import { saveLog } from '~/services/auditLogService';
import useAccountInfo from '~/hooks/data/useAccountInfo';
const cx = classNames.bind(styles);

function ImportStepTwo({ onBack, onNext, dictId, dictName, importData, setNumberSuccessRecord }) {
    const queryClient = useQueryClient();
    const { data: accountInfo } = useAccountInfo();
    const currentDictionaryId = useMemo(() => accountInfo?.Dictionary?.DictionaryId, [accountInfo]);

    const { data: numberRecord } = useQuery({
        queryKey: ['numberRecord', dictId],
        queryFn: async () => {
            const res = await getNumberRecord(dictId);
            return res.data.Data;
        },
    });

    const [openAlert, setOpenAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        content: '',
        action: () => {},
    });

    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const getAlertContent = () => {
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            let alertContent = `${formatNumber(numberRecord.NumberConcept)} concept(s) and ${formatNumber(
                numberRecord.NumberExample,
            )} example(s) in this dictionary will be lost and cannot be recovered. Are you sure?`;
            return alertContent;
        }
        return '';
    };

    const textValidRecord = useMemo(() => {
        let num = formatNumber(importData?.NumberValid ?? 0);
        return num > 1 ? num + ' valid records' : num + ' valid record';
    }, [importData]);

    const textErrorRecord = useMemo(() => {
        let num = formatNumber(importData?.NumberError ?? 0);
        return num > 1 ? num + ' invalid records' : num + ' invalid record';
    }, [importData]);

    const handleDownloadErrorFile = async () => {
        if (!importData?.StrFileError) {
            return;
        }

        let blob = await fetch(`data:${HUSTConstant.FileContentType.Excel2007};base64,${importData.StrFileError}`).then(
            (res) => res.blob(),
        );
        // create file link in browser's memory
        const href = URL.createObjectURL(blob);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'HUSTPVO_ErrorFile.xlsx');
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const { mutate: handleDoImport, isLoading: isLoadingDoImport } = useMutation(
        async () => {
            const res = await doImport(importData?.ImportSession);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Import successfully');
                    setNumberSuccessRecord(data.Data);

                    let logDescription = '';
                    if (numberRecord?.NumberConcept) {
                        logDescription += `Delete ${formatNumber(numberRecord.NumberConcept)} concept(s). `;
                    }
                    if (numberRecord?.NumberExample) {
                        logDescription += `Delete ${formatNumber(numberRecord.NumberExample)} example(s). `;
                    }

                    if (data.Data) {
                        logDescription += `Import ${formatNumber(data.Data)} record(s). `;
                    }

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.ImportData.Type,
                        Reference: `Dictionary: ${dictName}`,
                        Description: logDescription,
                    };
                    saveLog(logParam);
                    onNext();

                    // 15.07.2023: invalidate để load lại form View all concepts
                    if (dictId === currentDictionaryId) {
                        queryClient.invalidateQueries(['searchConcept']);
                    }

                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Import failed');
                } else {
                    toast.error('Import failed');
                }
            },
        },
    );

    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        // Check số lượng > 0
        if (numberRecord?.NumberConcept || numberRecord?.NumberExample) {
            setAlertConfig({
                title: 'Confirm import',
                content: getAlertContent(),
                action: handleDoImport,
            });
            handleOpenAlert(true);
        } else {
            handleDoImport();
        }
    };

    return (
        <Box className={cx('wrapper')}>
            {openAlert && (
                <AlertDialog
                    title={alertConfig.title}
                    content={alertConfig.content}
                    open={openAlert}
                    onClose={handleCloseAlert}
                >
                    <Button color="minor" size="large" onClick={handleCloseAlert}>
                        Cancel
                    </Button>
                    <Button size="large" onClick={alertConfig.action}>
                        Accept continue
                    </Button>
                </AlertDialog>
            )}
            {isLoadingDoImport && <Loading />}
            <div className={cx('content-header')}>
                <Typography variant="h6">Step 2: Check import data</Typography>
                <Typography>Check the data of the import file uploaded</Typography>
            </div>
            <div className={cx('content-main')}>
                <div className={cx('left-wrapper')}>
                    <Paper
                        sx={{
                            ...stylePaper,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 4,
                        }}
                    >
                        <Box className={cx('text-num-record')} color="primary.main" mb={1}>
                            <CheckCircle />
                            <Typography ml={1} fontSize="1.5rem" fontWeight="500">
                                {textValidRecord}
                            </Typography>
                        </Box>
                        <Box className={cx('text-num-record')} color="error.main">
                            <Error />
                            <Typography ml={1} fontSize="1.5rem" fontWeight="500">
                                {textErrorRecord}
                            </Typography>
                        </Box>
                    </Paper>
                    {(importData?.NumberError ?? 0) > 0 && (
                        <Button
                            fullWidth
                            onClick={handleDownloadErrorFile}
                            endIcon={<Download />}
                            sx={{
                                fontWeight: '400',
                                mt: 1,
                            }}
                            variant="text"
                            color="minor"
                        >
                            Download error file
                        </Button>
                    )}
                </div>
                <Paper
                    sx={{
                        ...stylePaper,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        maxHeight: 380,
                        overflow: 'auto',
                    }}
                    className={cx('right-wrapper')}
                >
                    <Table stickyHeader aria-label="error import table" sx={{ minWidth: 800 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No.</TableCell>
                                <TableCell>Sheet</TableCell>
                                <TableCell>Row</TableCell>
                                <TableCell>Error description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {importData?.ListValidateError.map((row, index) => (
                                <TableRow hover key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell>{row.SheetName}</TableCell>
                                    <TableCell>{row.Row}</TableCell>
                                    <TableCell
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            maxWidth: 300,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {row.ErrorMessage}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {(importData?.ListValidateError?.length ?? 0) === 0 && (
                        <div className={cx('empty-img-wrapper')}>
                            <img alt="no error" src={emptyImg} width={1} height={1} />
                            <Typography>No data</Typography>
                        </div>
                    )}
                </Paper>
            </div>
            <div className={cx('content-footer')}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button color="inherit" variant="outlined" onClick={handleBack} sx={{ mr: 1, minWidth: 100 }}>
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

export default memo(ImportStepTwo);
