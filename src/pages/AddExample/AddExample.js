import { Helmet } from 'react-helmet-async';
import styles from './AddExample.module.scss';
import classNames from 'classnames/bind';
import { Box, Button, Checkbox, Chip, FormControlLabel, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import ListSearchConcept from '~/components/Concept/ListSearchConcept/ListSearchConcept';
import { LoadingButton } from '@mui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '~/utils/common/validate/yupGlobal';
import ExampleAttributeBox from '~/components/Example/ExampleAttributeBox';
import ExampleRelationAutocomplete from '~/components/Example/ExampleRelationAutocomplete';
import { addExample } from '~/services/exampleService';
import { Enum } from '~/utils/common/enumeration';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { toast } from 'react-toastify';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import ExampleRTEControl from '~/components/Example/ExampleRTEControl';
import { useLocation } from 'react-router-dom';
import { stripHtmlExceptHighlight } from '~/utils/common/utils';
import AlertDialog from '~/components/BaseComponent/AlertDialog';
import Loading from '~/components/Loading';
import useLocalStorage from '~/hooks/useLocalStorage';

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

const exampleDefaultValue = {
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
};

function AddExample() {
    // Xử lý nhận state khi được điều hướng tới từ màn khác
    const location = useLocation();
    // Dùng object để force update
    const { concept: initConcept = { title: '' } } = useMemo(
        () =>
            location.state || {
                concept: {
                    title: '',
                },
            },
        [location],
    );

    const [reuseParam, setReuseParam] = useLocalStorage('reuseParamAddExample', true);
    const [relation, setRelation] = useState(null);
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [listLinkedConcept, setListLinkedConcept] = useState([]);
    const [searchConcept, setSearchConcept] = useState(''); // Note: searchConcept không chứa giá trị search mới nhất hiện tại
    const [delaySearchConcept, setDelaySearchConcept] = useState(700);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        setDelaySearchConcept(0);
        // Truyền object để force update
        setSearchConcept({ value: initConcept?.title || '' });
        return window.history.replaceState({}, document.title);
    }, [initConcept]);

    // =========================================================================
    const { data: accountInfo } = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? '', [accountInfo]);
    // =========================================================================

    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: JSON.parse(JSON.stringify(exampleDefaultValue)),
        resolver: yupResolver(schema),
    });

    const { handleSubmit, reset, setError, setFocus } = methods;

    useEffect(() => {
        setFocus('example');
    }, [setFocus]);
    // ==========================================================================
    const { mutate: handleSave, isLoading: isLoadingSave } = useMutation(
        async (data) => {
            const res = await addExample({
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
                    toast.success('Add example successfully');

                    saveAuditLog(reqData);

                    if (reuseParam) {
                        resetReuseParam(reqData);
                    } else {
                        resetNotReuseParam();
                    }
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Add example failed');
                    if (
                        data.ErrorCode === HUSTConstant.ErrorCode.Err4001 ||
                        data.ErrorCode === HUSTConstant.ErrorCode.Err4002
                    ) {
                        setError('example', { type: data.ErrorCode, message: data.Message }, { shouldFocus: true });
                    }
                } else {
                    toast.error('Add example failed');
                }
            },
        },
    );

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
        // if (searchConcept !== linkedConcept.Concept) {
        //     setDelaySearchConcept(0);
        //     setSearchConcept(linkedConcept.Concept);
        //     console.log('khác', searchConcept, linkedConcept.Concept);
        // } else {
        //     setSelectedConcept({
        //         Title: linkedConcept.Concept,
        //         ConceptId: linkedConcept.ConceptId,
        //     });
        //     console.log('bằng');
        // }
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
    const resetNotReuseParam = () => {
        // TODO: bug do searchConcept không lưu giá trị mới nhất của searchValue
        // Tạm fix bằng cách pass object => force update
        setDelaySearchConcept(0);
        setSearchConcept({ value: '' });
        setListLinkedConcept([]);
        reset(JSON.parse(JSON.stringify(exampleDefaultValue)));
    };

    const resetReuseParam = (param) => {
        // TODO: bug do searchConcept không lưu giá trị mới nhất của searchValue
        // Tạm fix bằng cách pass object => force update
        setDelaySearchConcept(0);
        setSearchConcept({ value: '' });
        setListLinkedConcept([]);
        reset({
            example: '',
            tone: param?.tone || {
                ToneName: 'Neutral',
                ToneId: null,
            },
            mode: param?.mode || {
                ModeName: 'Neutral',
                ModeId: null,
            },
            register: param?.register || {
                RegisterName: 'Neutral',
                RegisterId: null,
            },
            nuance: param?.nuance || {
                NuanceName: 'Neutral',
                NuanceId: null,
            },
            dialect: param?.dialect || {
                DialectName: 'Neutral',
                DialectId: null,
            },
            note: param?.note || '',
        });
    };

    const saveAuditLog = (reqData) => {
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
            ScreenInfo: HUSTConstant.ScreenInfo.Example,
            ActionType: HUSTConstant.LogAction.AddExample.Type,
            Reference: `Dictionary: ${dictionaryName}`,
            Description: logDescription,
        };
        saveLog(logParam);
    };

    // ===========================================================================
    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleClickSave = (data) => {
        if (listLinkedConcept && listLinkedConcept.length > 0) {
            handleSave(data);
        } else {
            handleOpenAlert();
        }
    };

    const handleClickAcceptAlert = () => {
        handleCloseAlert();
        handleSubmit(handleSave)();
    };

    // ===========================================================================

    return (
        <div className={cx('wrapper')}>
            {isLoadingSave && <Loading />}
            {openAlert && (
                <AlertDialog
                    title="Undecided example"
                    content="This example is not linked to any concepts yet. It will be temporarily categorized as Undecided. Are you sure?"
                    open={openAlert}
                    onClose={handleCloseAlert}
                >
                    <Button color="minor" size="large" onClick={handleCloseAlert}>
                        Cancel
                    </Button>
                    <Button size="large" onClick={handleClickAcceptAlert}>
                        Accept continue
                    </Button>
                </AlertDialog>
            )}
            <Helmet>
                <title>Example | HUST PVO</title>
            </Helmet>
            <div className={cx('main-wrapper')}>
                <Typography variant="h4">Example</Typography>
                <FormProvider {...methods}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5} order={{ md: 1, sm: 1, xs: 1 }}>
                            <Paper
                                sx={{ ...customStylePaper, maxHeight: 280 }}
                                className={cx('main-item', 'item-example')}
                            >
                                {/* <ExampleControl sx={{ mt: 1 }} /> */}
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

            <Box className={cx('action-wrapper')} sx={{ px: 1, pt: 2 }}>
                <FormControlLabel
                    id="ckbReuseParam"
                    label="Re-use parameters"
                    control={<Checkbox />}
                    checked={reuseParam}
                    onChange={() => setReuseParam(!reuseParam)}
                />
                <LoadingButton
                    sx={{ display: 'inline-block', minWidth: 100 }}
                    variant="contained"
                    size="large"
                    onClick={handleSubmit(handleClickSave)}
                >
                    Save & Reset
                </LoadingButton>
            </Box>
        </div>
    );
}

export default AddExample;
