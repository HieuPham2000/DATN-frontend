import classNames from 'classnames/bind';
import styles from './SearchConceptAssociationTab.module.scss';
import { Box, IconButton, ListItemButton, ListItemText, Paper, Snackbar, Typography, useTheme } from '@mui/material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import SearchLinkedConceptAutocomplete from '~/components/SearchPage/SearchLinkedConceptAutocomplete';
import { getListRecommendConcept } from '~/services/conceptService';
import { Graph } from 'react-d3-graph';
import searchImg from '~/assets/images/search.svg';
import { ContentCopy } from '@mui/icons-material';

const cx = classNames.bind(styles);
const myConfig = (theme) => ({
    maxZoom: 3,
    minZoom: 1,
    initialZoom: 1.5,
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    highlightOpacity: 0.2,
    node: {
        fontColor: theme.palette.text.primary,
        highlightColor: '#00ab55',
        highlightFontSize: 12,
        highlightFontWeight: '500',
        highlightStrokeColor: '#00ab55',
        highlightStrokeWidth: 1.5,
    },
    link: {
        highlightColor: '#00ab55',
        highlightFontSize: 8,
        highlightFontWeight: 'normal',
    },
});

function SearchConceptAssociationTab() {
    const theme = useTheme();
    const [listResult, setListResult] = useState([]);
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });
    const [openSnack, setOpenSnack] = useState(false);
    const [config, setConfig] = useState(null);
    const ref = useRef(null);

    useLayoutEffect(() => {
        if (!ref.current) return;
        const { clientWidth, clientHeight } = ref.current;
        const configNew = { ...myConfig(theme), width: clientWidth, height: clientHeight };
        setConfig(configNew);
    }, [ref, theme]);

    // ======================================================================
    const methods = useForm({
        mode: 'onSubmit',
        defaultValues: {
            listLinkedConcept: [],
        },
    });

    const { handleSubmit, control } = methods;

    const listLinkedConcept = useWatch({
        control,
        name: 'listLinkedConcept',
    });

    // =======================================================================

    const { mutate: handleSearch, isLoading } = useMutation(
        async (data) => {
            let keywords = data.listLinkedConcept?.map((x) => x.Title) || [];
            const res = await getListRecommendConcept(keywords);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    processAfterSearchSuccess(data?.Data);
                    // toast.success('Search successfully');
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    setListResult([]);
                    toast.error(data.Message || 'Search failed');
                } else {
                    setListResult([]);
                    toast.error('Search failed');
                }
            },
        },
    );

    const processAfterSearchSuccess = (data) => {
        // Danh sách concept
        setListResult(data?.Result || []);

        // Đồ thị
        let keywords = listLinkedConcept?.map((x) => x.Title) || [];
        let isPrimaryNode = (x) => keywords.includes(x),
            getNodeColor = (x) => (isPrimaryNode(x) ? '#ff5630' : '#d3d3d3'),
            isPrimaryEdge = (source, target) => keywords.includes(source) && keywords.includes(target),
            isSecondaryEdge = (source, target) => keywords.includes(source) || keywords.includes(target),
            getEdgeColor = (source, target) =>
                isPrimaryEdge(source, target) ? '#ff5630' : isSecondaryEdge(source, target) ? '#ffac82' : '#d3d3d3';

        let nodes =
                data?.Nodes?.map((x) => ({
                    id: x,
                    color: getNodeColor(x),
                })) || [],
            links =
                data?.Links?.map((x) => ({
                    source: x.Concept1,
                    target: x.Concept2,
                    color: getEdgeColor(x.Concept1, x.Concept2),
                })) || [];

        // Tự thêm liên kết 1 node đến chính nó: để các node lẻ sẽ xuất hiện ở giữa
        nodes.forEach((x) => links.push({ source: x.id, target: x.id }));

        setGraphData({
            nodes,
            links,
        });
    };

    // =================================================================
    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        handleOpenSnack();
    };

    // const fullScreen = () => {
    //     ref.current.requestFullscreen();
    // };

    // const exitFullScreen = () => {
    //     document.exitFullscreen();
    // };
    // ==============================================================

    return (
        <FormProvider {...methods}>
            <div className={cx('wrapper')}>
                {isLoading && <Loading />}
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSnack}
                    onClose={handleCloseSnack}
                    message="Copied to clipboard!"
                    autoHideDuration={1000}
                />
                <SearchLinkedConceptAutocomplete limit={10} />

                <Box className={cx('action-wrapper')} sx={{ px: 1 }}>
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
            </div>
            <Paper sx={{ ...stylePaper, p: 2, mx: 1, my: 2, maxHeight: 400, overflow: 'auto' }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Search results:
                    </Typography>
                    {listResult.length === 0 ? ' No data' : ''}
                </Typography>
                {listResult.map((x, index) => (
                    <ListItemButton key={index} sx={{ px: 2 }}>
                        <ListItemText>
                            {index + 1} - {x.Key}
                        </ListItemText>
                        <IconButton onClick={() => handleCopyToClipboard(x.Key)}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </ListItemButton>
                ))}
            </Paper>
            <Paper sx={{ ...stylePaper, p: 2, mx: 1, my: 2, height: 400 }}>
                <Typography>
                    <Typography component="span" color="primary" sx={{ fontWeight: '500', mb: 1 }}>
                        Graph:
                    </Typography>
                    {graphData.nodes.length === 0 ? ' No data' : ''}
                </Typography>
                <Box
                    className={cx('graph-wrapper')}
                    sx={{
                        width: '100%',
                        height: 'calc(100% - 24px)',
                        // '&::backdrop, &:fullscreen': {
                        //     bgcolor: 'background.default',
                        // },
                    }}
                    ref={ref}
                >
                    {graphData.nodes.length > 0 && <Graph id="graph-concept-link" data={graphData} config={config} />}
                    {graphData.nodes.length === 0 && (
                        <img src={searchImg} alt="no data" className={cx('no-data-graph')} />
                    )}
                </Box>
            </Paper>
        </FormProvider>
    );
}

export default memo(SearchConceptAssociationTab);
