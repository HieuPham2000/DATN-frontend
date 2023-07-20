import { Helmet } from 'react-helmet-async';
import styles from './EditExampleDialogContent.module.scss';
import classNames from 'classnames/bind';
import { Box, Button, Chip, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import ListSearchConcept from '~/components/Concept/ListSearchConcept/ListSearchConcept';
import { LoadingButton } from '@mui/lab';
import { memo, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '~/utils/common/validate/yupGlobal';
import ExampleAttributeBox from '~/components/Example/ExampleAttributeBox';
import ExampleRelationAutocomplete from '~/components/Example/ExampleRelationAutocomplete';
import { deleteExample, getExample, updateExample } from '~/services/exampleService';
import { Enum } from '~/utils/common/enumeration';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { toast } from 'react-toastify';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import ExampleRTEControl from '~/components/Example/ExampleRTEControl';
import { stripHtmlExceptHighlight } from '~/utils/common/utils';
import AlertDialog from '~/components/BaseComponent/AlertDialog';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);
const schema = yup.object().shape({
    example: yup
        .string()
        .textHtmlMaxLength(1000, 'Maximum length is 1000 characters')
        .textHtmlRequired('Example is required'),
    note: yup.string().max(1000, 'Maximum length is 1000 characters'),
});

const customStylePaper = {
    ...stylePaper,
    p: 2,
    m: 1,
    mb: 2,
};
function EditExampleDialogContent({ onClose, exampleId, handleAfter = () => {} }) {
    const [relation, setRelation] = useState(null);

    const [selectedConcept, setSelectedConcept] = useState(null);

    const [listLinkedConcept, setListLinkedConcept] = useState([]);

    const [searchConcept, setSearchConcept] = useState(''); // Note: searchConcept không chứa giá trị search mới nhất hiện tại
    const [delaySearchConcept, setDelaySearchConcept] = useState(700);

    const [openSaveAlert, setOpenSaveAlert] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    // =========================================================================
    const { data: accountInfo } = useAccountInfo();
    const dictionary = useMemo(() => accountInfo?.Dictionary ?? {}, [accountInfo]);
    // =========================================================================

    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: {
            example: '',
            tone: {
                ToneName: 'Neutral',
                ToneId: null,
            },
            mode: {
                ModeName: 'Neutral',
                ModeId: null,
            },
            register: {
                RegisterName: 'Neutral',
                RegisterId: null,
            },
            nuance: {
                NuanceName: 'Neutral',
                NuanceId: null,
            },
            dialect: {
                DialectName: 'Neutral',
                DialectId: null,
            },
            note: '',
        },
        resolver: yupResolver(schema),
    });

    const { handleSubmit, reset, setError, setFocus } = methods;

    useEffect(() => {
        setFocus('example');
    }, [setFocus]);

    //#region Lấy dữ liệu
    const { data: currentExample, isLoading: isLoadingExample } = useQuery({
        queryKey: ['example', exampleId],
        queryFn: async () => {
            const res = await getExample(exampleId);
            return res.data.Data;
        },
    });

    useEffect(() => {
        if (currentExample) {
            reset({
                example: currentExample.DetailHtml || '',
                tone: {
                    ToneId: currentExample.ToneId,
                    ToneName: currentExample.ToneName,
                },
                mode: {
                    ModeId: currentExample.ModeId,
                    ModeName: currentExample.ModeName,
                },
                register: {
                    RegisterId: currentExample.RegisterId,
                    RegisterName: currentExample.RegisterName,
                },
                nuance: {
                    NuanceId: currentExample.NuanceId,
                    NuanceName: currentExample.NuanceName,
                },
                dialect: {
                    DialectId: currentExample.DialectId,
                    DialectName: currentExample.DialectName,
                },
                note: currentExample.Note,
            });
            setListLinkedConcept(
                (currentExample.ListExampleRelationship || []).map((x) => ({
                    ConceptId: x.ConceptId,
                    Concept: x.Concept,
                    ExampleLinkId: x.ExampleLinkId,
                    ExampleLinkName: x.ExampleLinkName,
                })),
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentExample]);
    //#endregion

    //#region API save, delete
    const { mutate: handleSave, isLoading: isLoadingSave } = useMutation(
        async (data) => {
            const res = await updateExample({
                ModifiedDate: currentExample?.ModifiedDate,
                ExampleId: exampleId,
                DictionaryId: dictionary.DictionaryId,
                DetailHtml: data.example,
                ToneId: data.tone?.ToneId,
                ModeId: data.mode?.ModeId,
                RegisterId: data.register?.RegisterId,
                NuanceId: data?.nuance?.NuanceId,
                DialectId: data.dialect?.DialectId,
                Note: data.note,
                ListExampleRelationship: listLinkedConcept,
            });
            return res.data;
        },
        {
            onSuccess: (data, reqData) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Save successfully');
                    saveAuditLogUpdate(reqData);
                    handleAfter();
                    handleClose();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Save failed');
                    if (
                        data.ErrorCode === HUSTConstant.ErrorCode.Err4001 ||
                        data.ErrorCode === HUSTConstant.ErrorCode.Err4002
                    ) {
                        setError('example', { type: data.ErrorCode, message: data.Message }, { shouldFocus: true });
                    }
                } else {
                    toast.error('Save failed');
                }
            },
        },
    );
    const { mutate: handleDelete, isLoading: isLoadingDelete } = useMutation(
        async () => {
            const res = await deleteExample(exampleId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Delete successfully');
                    saveAuditLogDelete();
                    handleAfter();
                    handleClose();
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Delete failed');
                } else {
                    toast.error('Delete failed');
                }
            },
        },
    );
    //#endregion

    // ==========================================================================
    const handleAddLinkedConcept = () => {
        let tmpList = [...listLinkedConcept],
            existItem = tmpList.find((x) => x.ConceptId === selectedConcept?.ConceptId);

        if (existItem != null) {
            existItem.ExampleLinkId = relation.ExampleLinkId;
            existItem.ExampleLinkName = relation.ExampleLinkName;
            setListLinkedConcept(tmpList);
        } else {
            setListLinkedConcept([
                ...tmpList,
                {
                    ConceptId: selectedConcept.ConceptId,
                    Concept: selectedConcept.Title,
                    ExampleLinkId: relation.ExampleLinkId,
                    ExampleLinkName: relation.ExampleLinkName,
                },
            ]);
        }

        setSelectedConcept(null);
    };

    const handleDeleteLinkedConcept = (conceptId) => {
        setListLinkedConcept((lst) => lst.filter((x) => x.ConceptId !== conceptId));
    };

    const handleClickLinkedConcept = (linkedConcept) => {
        setRelation({
            ExampleLinkId: linkedConcept.ExampleLinkId,
            ExampleLinkName: linkedConcept.ExampleLinkName,
        });

        // TODO: bug do searchConcept không lưu giá trị mới nhất của searchValue
        // Do đó so sánh sẽ không đúng (searchConcept có thể vẫn lưu giá trị lần set manually trước đó)
        setDelaySearchConcept(0);
        setSearchConcept(linkedConcept.Concept);
        setSelectedConcept({
            Title: linkedConcept.Concept,
            ConceptId: linkedConcept.ConceptId,
        });
    };

    const handleSaveLink = () => {
        if (!!relation && relation?.ExampleLinkName !== 'No link') {
            handleAddLinkedConcept();
        } else {
            handleDeleteLinkedConcept(selectedConcept?.ConceptId);
        }
    };

    useEffect(() => {
        let existRelation = listLinkedConcept.find((x) => x.ConceptId === selectedConcept?.ConceptId);
        if (existRelation != null) {
            setRelation({
                ExampleLinkId: existRelation.ExampleLinkId,
                ExampleLinkName: existRelation.ExampleLinkName,
            });
        } else if (!selectedConcept) {
            setRelation(null);
        } else {
            setRelation({
                ExampleLinkName: 'No link',
                ExampleLinkId: null,
            });
        }
    }, [selectedConcept, listLinkedConcept]);

    // ==================================================================================
    const saveAuditLogUpdate = (reqData) => {
        // TODO: Cần có cách log thông tin hữu ích hơn
        let logDescription = `Example: `,
            logExample = stripHtmlExceptHighlight(reqData.example);

        if (reqData.tone?.ToneName && reqData.tone.ToneName !== 'Neutral') {
            logDescription += `[${reqData.tone.ToneName}] `;
        }
        if (reqData.mode?.ModeName && reqData.mode.ModeName !== 'Neutral') {
            logDescription += `[${reqData.mode.ModeName}] `;
        }
        if (reqData.register?.RegisterName && reqData.register.RegisterName !== 'Neutral') {
            logDescription += `[${reqData.register.RegisterName}] `;
        }
        if (reqData.nuance?.NuanceName && reqData.nuance.NuanceName !== 'Neutral') {
            logDescription += `[${reqData.nuance.NuanceName}] `;
        }
        if (reqData.dialect?.DialectName && reqData.dialect.DialectName !== 'Neutral') {
            logDescription += `[${reqData.dialect.DialectName}] `;
        }
        if (logExample.length > 50) {
            logExample = logExample.substring(0, 50) + '...';
        }
        logDescription += logExample;

        let logParam = {
            ScreenInfo: HUSTConstant.ScreenInfo.EditExample,
            ActionType: HUSTConstant.LogAction.EditExample.Type,
            Reference: `Dictionary: ${dictionary.DictionaryName}`,
            Description: logDescription,
        };
        saveLog(logParam);
    };

    const saveAuditLogDelete = () => {
        let logDescription = `Example: `,
            logExample = stripHtmlExceptHighlight(currentExample?.DetailHtml);

        if (logExample.length > 50) {
            logExample = logExample.substring(0, 50) + '...';
        }
        logDescription += logExample;

        let logParam = {
            ScreenInfo: HUSTConstant.ScreenInfo.EditExample,
            ActionType: HUSTConstant.LogAction.DeleteExample.Type,
            Reference: `Dictionary: ${dictionary.DictionaryName}`,
            Description: logDescription,
        };
        saveLog(logParam);
    };
    // ===========================================================================
    const handleOpenSaveAlert = () => {
        setOpenSaveAlert(true);
    };

    const handleCloseSaveAlert = () => {
        setOpenSaveAlert(false);
    };

    const handleClickSave = (data) => {
        if (listLinkedConcept && listLinkedConcept.length > 0) {
            handleSave(data);
        } else {
            handleOpenSaveAlert();
        }
    };

    const handleClickAcceptAlert = () => {
        handleCloseSaveAlert();
        handleSubmit(handleSave)();
    };
    // ================================= Click delete & Delete alert ============
    const handleOpenDeleteAlert = () => {
        setOpenDeleteAlert(true);
    };

    const handleCloseDeleteAlert = () => {
        setOpenDeleteAlert(false);
    };

    const handleClickDelete = () => {
        handleOpenDeleteAlert();
    };
    // ================================== Close ==================================
    const handleClose = () => {
        onClose();
    };
    // ===========================================================================

    return (
        <div className={cx('wrapper')}>
            {(isLoadingExample || isLoadingDelete || isLoadingSave) && <Loading />}
            {openSaveAlert && (
                <AlertDialog
                    title="Undecided example"
                    content="This example is not linked to any concepts yet. It will be temporarily categorized as Undecided. Are you sure?"
                    open={openSaveAlert}
                    onClose={handleCloseSaveAlert}
                >
                    <Button color="minor" size="large" onClick={handleCloseSaveAlert}>
                        Cancel
                    </Button>
                    <Button size="large" onClick={handleClickAcceptAlert}>
                        Accept continue
                    </Button>
                </AlertDialog>
            )}
            {openDeleteAlert && (
                <AlertDialog
                    title="Confirm example deletion"
                    content="Deleted example cannot be recovered. Are you sure?"
                    open={openDeleteAlert}
                    onClose={handleCloseDeleteAlert}
                >
                    <Button color="minor" size="large" onClick={handleCloseDeleteAlert}>
                        Cancel
                    </Button>
                    <Button color="error" size="large" onClick={handleDelete}>
                        Delete
                    </Button>
                </AlertDialog>
            )}
            <Helmet>
                <title>Edit Example | HUST PVO</title>
            </Helmet>
            <div className={cx('main-wrapper')}>
                <FormProvider {...methods}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5} order={{ md: 1, sm: 1, xs: 1 }}>
                            <Paper
                                sx={{ ...customStylePaper, maxHeight: 280 }}
                                className={cx('main-item', 'item-example')}
                            >
                                <ExampleRTEControl style={{ marginTop: '8px' }} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4} md={3} order={{ md: 2, sm: 3, xs: 4 }}>
                            <Paper sx={{ ...customStylePaper }} className={cx('main-item', 'item-relation')}>
                                <ExampleRelationAutocomplete
                                    value={relation}
                                    setValue={setRelation}
                                    sx={{ mt: 1 }}
                                    disabled={!selectedConcept}
                                />
                                <Button
                                    sx={{ mt: 2, display: 'inline-block', minWidth: 100 }}
                                    color="primary"
                                    variant="outlined"
                                    onClick={handleSaveLink}
                                    disabled={!selectedConcept || !relation}
                                >
                                    Link
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={8} md={4} order={{ md: 3, sm: 2, xs: 3 }}>
                            <Paper
                                sx={{ ...customStylePaper, height: 300, display: 'flex', flexDirection: 'column' }}
                                className={cx('main-item', 'item-search-concept')}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        minHeight: '32px',
                                        flexWrap: 'wrap',
                                        mb: 1,
                                    }}
                                >
                                    {!selectedConcept ? (
                                        <Typography color="text.secondary">No selected concept</Typography>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontWeight: '500', mr: 1 }} color="primary">
                                                Selected concept:
                                            </Typography>
                                            <Chip label={selectedConcept.Title} />
                                        </>
                                    )}
                                </Box>

                                <ListSearchConcept
                                    labelText="Search concept"
                                    selectedRow={selectedConcept}
                                    setSelectedRow={setSelectedConcept}
                                    showContextMenu={false}
                                    defaultSearchValue={searchConcept}
                                    delaySearch={delaySearchConcept}
                                    setDelaySearch={setDelaySearchConcept}
                                    shrinkLabel
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={8} order={{ md: 4, sm: 4, xs: 2 }}>
                            <Box className={cx('main-item', 'item-attribute')}>
                                <ExampleAttributeBox />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} order={{ md: 5, sm: 5, xs: 5 }}>
                            <Paper sx={{ ...customStylePaper }} className={cx('main-item', 'item-linked-concept')}>
                                <Box>
                                    <Typography color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                                        Linked Concepts
                                    </Typography>
                                    {listLinkedConcept && listLinkedConcept.length > 0 ? (
                                        <Box>
                                            {listLinkedConcept.map((x) => (
                                                <Tooltip title={x.ExampleLinkName} key={x.ConceptId}>
                                                    <Chip
                                                        label={x.Concept}
                                                        onClick={() => handleClickLinkedConcept(x)}
                                                        onDelete={() => handleDeleteLinkedConcept(x.ConceptId)}
                                                        sx={{ mr: 1, my: 0.5 }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary">No linked concepts</Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </FormProvider>
            </div>

            <Box className={cx('action-wrapper')} sx={{ px: 1, py: 1 }}>
                <Button sx={{ display: 'inline-block', minWidth: 100, mr: 1 }} size="large" onClick={handleClose}>
                    Cancel
                </Button>
                <LoadingButton
                    sx={{ display: 'inline-block', minWidth: 100, mr: 1 }}
                    size="large"
                    color="error"
                    loading={isLoadingDelete}
                    onClick={handleClickDelete}
                >
                    Delete
                </LoadingButton>
                <LoadingButton
                    sx={{ display: 'inline-block', minWidth: 100 }}
                    variant="contained"
                    size="large"
                    loading={isLoadingSave}
                    onClick={handleSubmit(handleClickSave)}
                >
                    Save & Close
                </LoadingButton>
            </Box>
        </div>
    );
}

export default memo(EditExampleDialogContent);
