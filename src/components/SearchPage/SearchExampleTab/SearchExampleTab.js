import classNames from 'classnames/bind';
import styles from './SearchExampleTab.module.scss';
import { Box, Button, Checkbox, FormControlLabel, Grid, ListItemButton, Paper, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { memo, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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

const cx = classNames.bind(styles);

function SearchExampleTab() {
    const [isSaveParam, setIsSaveParam] = useState(true);
    const [listExample, setListExample] = useState([]);
    const [lastSearchParam, setLastSearchParam] = useLocalStorage('lastSearchParam', '');

    // ============================================================
    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: {
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
        },
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
                    setListExample(data.Data);
                    toast.success('Search successfully');
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
        reset();
    };

    return (
        <FormProvider {...methods}>
            <div className={cx('wrapper')}>
                {isLoading && <Loading />}
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                        <SearchExampleAttributeBox />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SearchExampleLinkedConceptBox />

                        <Box className={cx('action-wrapper')} sx={{ px: 1, pt: 2 }}>
                            <FormControlLabel
                                id="ckbSaveParam"
                                label="Save last search parameters"
                                control={<Checkbox />}
                                checked={isSaveParam}
                                onChange={() => setIsSaveParam(!isSaveParam)}
                            />
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
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2, maxHeight: 400, overflow: 'auto' }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Search results:
                    </Typography>
                    {listExample.length === 0 ? ' No data' : ''}
                </Typography>
                {listExample.map((x, index) => (
                    <ListItemButton key={index} sx={{ px: 2 }}>
                        <Typography component="div">
                            <Markdown
                                children={`${index + 1} - ${getDisplayExample(stripHtmlExceptHighlight(x.DetailHtml))}`}
                            />
                        </Typography>
                    </ListItemButton>
                ))}
            </Paper>
        </FormProvider>
    );
}

export default memo(SearchExampleTab);
