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
    Menu,
    MenuItem,
    Skeleton,
    Snackbar,
    TextField,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Close, ContentCopy, Search } from '@mui/icons-material';
import useDebounce from '~/hooks/useDebounce';
import { searchConcept } from '~/services/conceptService';
import EditConceptDialog from '~/components/Concept/EditConceptDialog';
import DeleteConceptDialog from '~/components/Concept/DeleteConceptDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSettingByKey } from '~/services/userSettingService';
import HUSTConstant from '~/utils/common/constant';

function ListConceptDialog({ open, onClose }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const queryClient = useQueryClient();

    const [openSnack, setOpenSnack] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchKey = useDebounce(searchValue, 1000);
    const [reClickMaster, setReClickMaster] = useState(false);

    const [contextMenu, setContextMenu] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const { data: settingData } = useQuery({
        queryKey: ['userSetting', HUSTConstant.UserSettingKey.IsSearchSoundex],
        queryFn: async () => {
            const res = await getUserSettingByKey(HUSTConstant.UserSettingKey.IsSearchSoundex);
            return res.data.Data;
        },
        staleTime: 30000,
    });

    const { data: dataSearch, isLoading: isLoadingSearch } = useQuery({
        queryKey: ['searchConcept', searchKey?.trim(), settingData?.SettingValue],
        queryFn: async () => {
            const res = await searchConcept({
                searchKey: searchKey?.trim(),
                isSearchSoundex: settingData?.SettingValue,
            });
            return res.data.Data;
        },
        onSuccess: (data) => {
            if (!reClickMaster || !data || !data.length || !selectedRow) {
                setSelectedRow(data ? data[0] : null);
            } else {
                let item = data.find((x) => x.ConceptId === selectedRow.ConceptId);
                setSelectedRow(item ?? data[0]);
                setReClickMaster(false);
            }
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
            }, 700);

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

    const handleContextMenu = (event, x) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null,
        );
        setSelectedRow(x);
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleEditConcept = () => {
        handleCloseContextMenu();
        setOpenEditDialog(true);
    };

    const handleDeleteConcept = () => {
        handleCloseContextMenu();
        setOpenDeleteDialog(true);
    };

    /**
     * Xử lý khi chọn Add example: Điều hướng sang màn example và tự động bind giá trị concept
     */
    const handleAddExample = () => {
        handleCloseContextMenu();
        handleClose();
        // navigate('/example', { state: { concept: selectedRow?.Title || '' } });
        // Truyền object để force update search example
        navigate('/example', {
            state: {
                concept: {
                    title: selectedRow?.Title || '',
                },
            },
        });
    };

    /**
     * Xử lý khi chọn View tree: Điều hướng sang màn tree và tự động bind giá trị concept
     */
    const handleViewTree = () => {
        handleCloseContextMenu();
        handleClose();
        navigate('/tree', {
            state: {
                concept: !!selectedRow ? { ...selectedRow } : null,
            },
        });
    };

    const handleAfterEditSuccess = () => {
        setReClickMaster(true);
        queryClient.invalidateQueries(['searchConcept']);

        if (pathname === '/' || pathname === '/dashboard') {
            queryClient.invalidateQueries(['getListMostRecentConcept']);
        }
    };

    const handleAfterDeleteSuccess = () => {
        queryClient.invalidateQueries(['searchConcept']);

        if (pathname === '/' || pathname === '/dashboard') {
            queryClient.invalidateQueries(['getListMostRecentConcept']);
            queryClient.invalidateQueries(['numberRecord']);
        }
    };

    const Content = (
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {openEditDialog && (
                <EditConceptDialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    conceptId={selectedRow?.ConceptId}
                    handleAfter={handleAfterEditSuccess}
                />
            )}
            {openDeleteDialog && (
                <DeleteConceptDialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    conceptId={selectedRow?.ConceptId}
                    handleAfter={handleAfterDeleteSuccess}
                />
            )}
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                }
            >
                <MenuItem onClick={handleAddExample}>Add example</MenuItem>
                <MenuItem onClick={handleViewTree}>View tree</MenuItem>
                <MenuItem onClick={handleEditConcept}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteConcept}>Delete</MenuItem>
            </Menu>

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
                autoComplete="off"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{ my: 1 }}
                autoFocus
                onFocus={(event) => {
                    event.target.select();
                }}
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
                            onContextMenu={(e) => handleContextMenu(e, x)}
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
