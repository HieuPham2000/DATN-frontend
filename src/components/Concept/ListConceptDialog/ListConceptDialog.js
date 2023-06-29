import { memo, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Skeleton,
    Snackbar,
    TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Close, ContentCopy, Search } from '@mui/icons-material';
import useDebounce from '~/hooks/useDebounce';
import { searchConcept } from '~/services/conceptService';

function ListConceptDialog({ open, onClose }) {
    const [openSnack, setOpenSnack] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchKey = useDebounce(searchValue, 1000);

    // const { data: accountInfo } = useAccountInfo();
    // const dictId = useMemo(() => accountInfo?.Dictionary?.DictionaryId ?? '', [accountInfo]);

    // const { data, isLoading } = useQuery({
    //     queryKey: ['listConcept', dictId],
    //     queryFn: async () => {
    //         const res = await getListConcept();
    //         return res.data.Data;
    //     },
    // });

    // const listConcept = useMemo(() => data?.ListConcept || [], [data]);

    const { data: dataSearch, isLoading: isLoadingSearch } = useQuery({
        queryKey: ['searchConcept', searchKey?.trim()],
        queryFn: async () => {
            const res = await searchConcept({
                searchKey: searchKey?.trim(),
                isSearchSoundex: true,
            });
            return res.data.Data;
        },
        onSuccess: (data) => {
            setSelectedRow(data ? data[0] : null);
        },
    });

    const [delayLoadingSearch, setDelayLoadingSearch] = useState(isLoadingSearch);

    useEffect(() => {
        if (isLoadingSearch) {
            setDelayLoadingSearch(true);
            return;
        } else {
            const handler = setTimeout(() => {
                setDelayLoadingSearch(false);
            }, 1000);

            return () => {
                clearTimeout(handler);
            };
        }
    }, [isLoadingSearch]);

    const handleClose = () => {
        onClose();
    };

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

    const handleSelectRow = (concept) => {
        setSelectedRow(concept);
    };

    const Content = (
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnack}
                onClose={handleCloseSnack}
                message="Copied to clipboard!"
                autoHideDuration={1000}
            />
            <TextField
                id="txtSearch"
                label="Search"
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{ my: 1 }}
                autoFocus
            />
            <List sx={{ flex: 1, overflow: 'auto' }} dense>
                {delayLoadingSearch && (
                    <>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </>
                )}
                {!delayLoadingSearch &&
                    !isLoadingSearch &&
                    dataSearch?.map((x) => (
                        <ListItemButton
                            key={x.ConceptId}
                            onClick={() => handleSelectRow(x)}
                            selected={selectedRow?.ConceptId === x.ConceptId}
                        >
                            <ListItemText sx={{ textAlign: 'left' }}>{x.Title}</ListItemText>
                            <IconButton onClick={() => handleCopyToClipboard(x)}>
                                <ContentCopy fontSize="small" />
                            </IconButton>
                        </ListItemButton>
                    ))}
                {!delayLoadingSearch && !isLoadingSearch && !dataSearch?.length && (
                    <ListItem>
                        <ListItemText sx={{ textAlign: 'center' }}>No match concept</ListItemText>
                    </ListItem>
                )}
            </List>

            {delayLoadingSearch ? (
                <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </>
            ) : (
                <TextField
                    id="conceptDescription"
                    label="Description"
                    multiline
                    rows={2}
                    size="small"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mt: 2 }}
                    value={selectedRow?.Description || ''}
                />
            )}
        </Box>
    );

    const Action = (
        <>
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', pl: 2 }}>
                {/* {data?.LastUpdatedAt && (
                    <Typography variant="caption">Last updated: {formatDateTime(data?.LastUpdatedAt)}</Typography>
                )} */}
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleClose}>Close</Button>
            </Box>
        </>
    );
    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
                disableRestoreFocus
                PaperProps={{
                    sx: {
                        minHeight: '90vh',
                    },
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mr: 2,
                        pb: 0,
                    }}
                >
                    Concepts
                </DialogTitle>
                <DialogContent
                    id="alert-dialog-description"
                    sx={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        pb: 0,
                    }}
                >
                    {Content}
                </DialogContent>
                <DialogActions>{Action}</DialogActions>
            </Dialog>
        </>
    );
}

export default memo(ListConceptDialog);
