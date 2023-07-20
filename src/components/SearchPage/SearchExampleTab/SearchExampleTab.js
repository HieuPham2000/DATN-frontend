import classNames from 'classnames/bind';
import styles from './SearchExampleTab.module.scss';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    ListItemButton,
    ListItemText,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { memo, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading';
import SearchExampleAttributeBox from '~/components/SearchPage/SearchExampleAttributeBox';
import SearchExampleLinkedConceptBox from '~/components/SearchPage/SearchExampleLinkedConceptBox';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { searchExample } from '~/services/exampleService';
import Markdown from '~/components/BaseComponent/Markdown/Markdown';
import { getDisplayExample, stripHtmlExceptHighlight } from '~/utils/common/utils';
import useLocalStorage from '~/hooks/useLocalStorage';
import EditExampleDialog from '~/components/Example/EditExampleDialog';
import { Edit } from '@mui/icons-material';
import ExampleShortView from '~/components/Example/ExampleShortView';

const cx = classNames.bind(styles);

function SearchExampleTab() {
    const queryClient = useQueryClient();
    const [isSaveParam, setIsSaveParam] = useState(true);
    const [listExample, setListExample] = useState([]);
    const [lastSearchParam, setLastSearchParam] = useLocalStorage('lastSearchParam', '');

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);
    const [isShowToastSuccess, setShowToastSuccess] = useState(true);

    // ============================================================
    const defaultFormData = {
        isSearchUndecided: false,
        listLinkedConcept: [],
        keyword: '',
        tone: {
            ToneName: 'All',
            ToneId: null,
        },
        mode: {
            ModeName: 'All',
            ModeId: null,
        },
        register: {
            RegisterName: 'All',
            RegisterId: null,
        },
        nuance: {
            NuanceName: 'All',
            NuanceId: null,
        },
        dialect: {
            DialectName: 'All',
            DialectId: null,
        },
    };
    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: JSON.parse(JSON.stringify(defaultFormData)),
    });

    const {
        handleSubmit,
        reset,
        formState: { defaultValues },
    } = methods;

    // ============================================================
    useEffect(() => {
        if (lastSearchParam && typeof lastSearchParam === 'object') {
            reset({
                ...defaultValues,
                ...lastSearchParam,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ============================================================

    const { mutate: handleSearch, isLoading } = useMutation(
        async (data) => {
            // console.log(data);
            const res = await searchExample({
                Keyword: data.keyword?.trim(),
                ToneId: data.tone?.ToneId,
                ModeId: data.mode?.ModeId,
                RegisterId: data.register?.RegisterId,
                NuanceId: data?.nuance?.NuanceId,
                DialectId: data.dialect?.DialectId,
                ListLinkedConceptId: data.listLinkedConcept?.map((x) => x.ConceptId) || [],
                IsSearchUndecided: data.isSearchUndecided,
                IsFulltextSearch: true,
            });
            return res.data;
        },
        {
            onSuccess: (data, formData) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    setSelectedExample(null);
                    setListExample(data.Data);

                    if (isShowToastSuccess) {
                        // toast.success('Search successfully');
                    } else {
                        setShowToastSuccess(true);
                    }

                    if (isSaveParam) {
                        setLastSearchParam(formData);
                    } else {
                        setLastSearchParam(null);
                    }
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    setListExample([]);
                    toast.error(data.Message || 'Search failed');
                } else {
                    setListExample([]);
                    toast.error('Search failed');
                }
            },
        },
    );

    // ============================================================
    const resetSearch = () => {
        reset(defaultFormData);
    };

    // ============================================================
    const handleClickExample = (x) => {
        setSelectedExample(x);
    };

    const handleDbClickExample = (x) => {
        setSelectedExample(x);
        setOpenDialog(true);
    };

    const handleAfterModifyExample = () => {
        setShowToastSuccess(false);
        queryClient.invalidateQueries(['example', selectedExample?.ExampleId]);
        handleSubmit(handleSearch)();
    };

    return (
        <FormProvider {...methods}>
            {openDialog && (
                <EditExampleDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    exampleId={selectedExample?.ExampleId}
                    handleAfter={handleAfterModifyExample}
                />
            )}
            <div className={cx('wrapper')}>
                {isLoading && <Loading />}
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                        <SearchExampleAttributeBox />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SearchExampleLinkedConceptBox />
                        <Box sx={{ px: 1 }}>
                            <FormControlLabel
                                id="ckbSaveParam"
                                label="Save last search parameters"
                                control={<Checkbox />}
                                checked={isSaveParam}
                                onChange={() => setIsSaveParam(!isSaveParam)}
                            />
                        </Box>
                        <Box className={cx('action-wrapper')} sx={{ px: 1 }}>
                            <Button
                                sx={{ display: 'inline-block', minWidth: 100, mr: 2 }}
                                size="large"
                                variant="outline"
                                onClick={resetSearch}
                            >
                                Reset
                            </Button>
                            <LoadingButton
                                sx={{ display: 'inline-block', minWidth: 100 }}
                                variant="contained"
                                size="large"
                                onClick={handleSubmit(handleSearch)}
                                loading={isLoading}
                            >
                                Search
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Search results:
                    </Typography>
                    {listExample.length === 0 ? ' No data' : ''}
                </Typography>
                {/* {listExample.length > 0 && (
                    <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'flex-start' }}
                        >
                            <Info fontSize="small" color="text.secondary" sx={{ mr: 0.2, pb: 0.2 }} />
                            Double-click to view/edit/delete example
                        </Typography>
                    </div>
                )} */}
                <div style={{ maxHeight: 320, overflow: 'auto' }}>
                    {listExample.map((x, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ px: 2 }}
                            onClick={() => handleClickExample(x)}
                            onDoubleClick={() => handleDbClickExample(x)}
                            selected={x.ExampleId === selectedExample?.ExampleId}
                        >
                            <ListItemText>
                                <Markdown
                                    children={`${index + 1} - ${getDisplayExample(
                                        stripHtmlExceptHighlight(x.DetailHtml),
                                    )}`}
                                />
                            </ListItemText>
                            <Tooltip title="Edit/Delete">
                                <IconButton onClick={() => handleDbClickExample(x)}>
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ListItemButton>
                    ))}
                </div>
            </Paper>
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Selected example:
                    </Typography>
                    {!selectedExample ? ' No data' : ''}
                    {!!selectedExample && (
                        <Tooltip title="Edit/Delete">
                            <IconButton onClick={() => handleDbClickExample(selectedExample)} sx={{ mb: 1 }}>
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Typography>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    <ExampleShortView exampleId={selectedExample?.ExampleId} />
                </div>
            </Paper>
        </FormProvider>
    );
}

export default memo(SearchExampleTab);
