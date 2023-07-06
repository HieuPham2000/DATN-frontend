import { Helmet } from 'react-helmet-async';
import styles from './TreePage.module.scss';
import classNames from 'classnames/bind';
import { Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import useLocalStorage from '~/hooks/useLocalStorage';
import ConceptAutocomplete from '~/components/TreePage/ConceptAutocomplete';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SimpleView from '~/components/TreePage/SimpleView';
import searchImg from '~/assets/images/search.svg';
import { useLocation } from 'react-router-dom';
import FullView from '~/components/TreePage/FullView';

const cx = classNames.bind(styles);

function TreePage() {
    const [fullMode, setFullMode] = useLocalStorage('treeFullMode', false);

    const [selectedConcept, setSelectedConcept] = useState(null);
    const [rootConcept, setRootConcept] = useState(null);

    useEffect(() => {
        if (rootConcept) {
            setSelectedConcept(rootConcept);
        }
    }, [rootConcept]);

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

    const handleClickShowTree = () => {
        if (selectedConcept) {
            setRootConcept(selectedConcept);
        } else {
            toast.warning('Concept is required');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Tree | HUST PVO</title>
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h4">Tree</Typography>
                <FormControlLabel
                    control={<Switch checked={fullMode} onChange={() => setFullMode(!fullMode)} />}
                    label="Full mode"
                    sx={{
                        ml: 2,
                        mr: 0,
                    }}
                />
            </Box>
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
                {!fullMode && !!rootConcept && <SimpleView rootConcept={rootConcept} setRootConcept={setRootConcept} />}
                {fullMode && !!rootConcept && <FullView rootConcept={rootConcept} setRootConcept={setRootConcept} />}
            </Box>
        </div>
    );
}

export default TreePage;
