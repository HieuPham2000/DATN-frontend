import { Helmet } from 'react-helmet-async';
import styles from './TreePage.module.scss';
import classNames from 'classnames/bind';
import { Box, Button, Typography } from '@mui/material';
import useLocalStorage from '~/hooks/useLocalStorage';
import { useMutation } from '@tanstack/react-query';
import ConceptAutocomplete from '~/components/TreePage/ConceptAutocomplete';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getLinkedExampleByRelationshipType, getTree } from '~/services/treeService';
import Loading from '~/components/Loading';
import { Enum } from '~/utils/common/enumeration';
import SimpleView from '~/components/TreePage/SimpleView';
import searchImg from '~/assets/images/search.svg';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function TreePage() {
    const [mode, setMode] = useLocalStorage('treeViewMode', 'simple');

    const [selectedConcept, setSelectedConcept] = useState(null);
    const [rootConcept, setRootConcept] = useState(null);
    const [treeData, setTreeData] = useState({});
    const [listExample, setListExample] = useState([]);

    // =============================================================================

    // Xử lý nhận state khi được điều hướng tới từ màn khác
    const location = useLocation();
    // Dùng object để force update
    const { concept: initConcept = {} } = useMemo(
        () =>
            location.state || {
                concept: {},
            },
        [location],
    );

    useEffect(() => {
        if (initConcept && initConcept.ConceptId) {
            setRootConcept({ ...initConcept });
        } else {
            setRootConcept(null);
        }
        return window.history.replaceState({}, document.title);
    }, [initConcept]);

    // =============================================================================

    const { mutate: handleShowTree, isLoading: isLoadingShowTree } = useMutation(
        async () => {
            const res = await getTree(rootConcept?.ConceptId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    setTreeData(data.Data);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    setTreeData({});
                    toast.error(data.Message || 'Show failed');
                } else {
                    setTreeData({});
                    toast.error('Show failed');
                }
            },
        },
    );

    const { mutate: getExampleByRelationType } = useMutation(
        async (exampleLinkId) => {
            const res = await getLinkedExampleByRelationshipType(rootConcept?.ConceptId, exampleLinkId);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    setListExample(data.Data);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    setListExample([]);
                } else {
                    setListExample([]);
                }
            },
        },
    );

    const handleClickShowTree = () => {
        if (selectedConcept) {
            setRootConcept(selectedConcept);
        } else {
            toast.warning('Concept is required');
        }
    };

    const handleClickConceptItem = (concept) => {
        setSelectedConcept(concept);
        setRootConcept(concept);
    };

    const handleClickRelationType = (exampleLinkId) => {
        getExampleByRelationType(exampleLinkId);
    };

    useEffect(() => {
        if (rootConcept) {
            setListExample([]);
            setSelectedConcept(rootConcept);
            handleShowTree();
        }
    }, [rootConcept, handleShowTree]);

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Tree | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Tree</Typography>
            {/* <FormControlLabel control={<Switch defaultChecked />} label="Label" /> */}
            {isLoadingShowTree && <Loading />}
            <Box className={cx('main-wrapper')} sx={{ mt: 2 }}>
                <Box className={cx('search-wrapper')}>
                    <ConceptAutocomplete
                        selectedConcept={selectedConcept}
                        setSelectedConcept={setSelectedConcept}
                        fullWidth
                        autoFocus
                    />
                    <Button
                        sx={{ display: 'inline-block', minWidth: 100, ml: 2 }}
                        variant="contained"
                        size="medium"
                        onClick={handleClickShowTree}
                    >
                        Show
                    </Button>
                </Box>
                {!rootConcept && (
                    <Box className={cx('img-wrapper')}>
                        <img src={searchImg} alt="search" className={cx('img-no-data')} />
                    </Box>
                )}
                {!!rootConcept && (
                    <SimpleView
                        treeData={treeData}
                        listExample={listExample}
                        onClickConcept={handleClickConceptItem}
                        onClickRelationType={handleClickRelationType}
                    />
                )}
                {/* <Button onClick={handlePrev}>Prev</Button>
                <Button onClick={handlePNext}>Next</Button> */}
            </Box>
        </div>
    );
}

export default TreePage;
