import { memo, useEffect, useState } from 'react';
import {
    Box,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Skeleton,
    TextField,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search } from '@mui/icons-material';
import useDebounce from '~/hooks/useDebounce';
import { searchConcept } from '~/services/conceptService';
import EditConceptDialog from '~/components/Concept/EditConceptDialog';
import DeleteConceptDialog from '~/components/Concept/DeleteConceptDialog';
import AddConceptDialog from '~/components/Concept/AddConceptDialog';

function ListSearchConcept({
    labelText = 'Search concept',
    autoFocus,
    selectedRow,
    setSelectedRow,
    defaultSearchValue = '',
    showContextMenu = true,
    shrinkLabel = false,
    defaultDelaySearch = 700,
    delaySearch = 700,
    setDelaySearch = null,
}) {
    const queryClient = useQueryClient();
    // const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchKey = useDebounce(searchValue, delaySearch);
    const [reClickMaster, setReClickMaster] = useState(false);

    const [contextMenu, setContextMenu] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const { data: dataSearch, isLoading: isLoadingSearch } = useQuery({
        queryKey: ['searchConcept', searchKey?.trim()],
        queryFn: async () => {
            const res = await searchConcept({
                searchKey: searchKey?.trim(),
                // isSearchSoundex: true,
            });
            return res.data.Data;
        },
        onSuccess: (data) => {
            if (typeof setDelaySearch === 'function') {
                setDelaySearch(defaultDelaySearch);
            }
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

    useEffect(() => {
        if (typeof defaultSearchValue === 'object' && defaultSearchValue.hasOwnProperty('value')) {
            setSearchValue(defaultSearchValue?.value);
        } else {
            setSearchValue(defaultSearchValue);
        }
    }, [defaultSearchValue]);

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
                : null,
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

    const handleAdd = () => {
        setOpenAddDialog(true);
    };

    const handleAfterEditSuccess = () => {
        setReClickMaster(true);
        queryClient.invalidateQueries(['searchConcept']);
    };

    const handleAfterDeleteSuccess = () => {
        queryClient.invalidateQueries(['searchConcept']);
    };

    const handleAfterAddSuccess = (newConceptTitle) => {
        queryClient.invalidateQueries(['searchConcept']);
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
            {openAddDialog && (
                <AddConceptDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    handleAfter={handleAfterAddSuccess}
                    defaultTitle={searchValue?.trim()}
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
                <MenuItem onClick={handleCloseContextMenu}>Add example</MenuItem>
                <MenuItem onClick={handleCloseContextMenu}>View tree</MenuItem>
                <MenuItem onClick={handleEditConcept}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteConcept}>Delete</MenuItem>
            </Menu>

            <TextField
                id="txtSearch"
                label={labelText}
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
                {...(shrinkLabel
                    ? {
                          InputLabelProps: {
                              shrink: shrinkLabel,
                          },
                      }
                    : {})}
                sx={{ my: 1 }}
                autoFocus={autoFocus}
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
                            selected={selectedRow?.ConceptId === x.ConceptId}
                            // onContextMenu={(e) => handleContextMenu(e, x)}
                            {...(showContextMenu ? { onContextMenu: (e) => handleContextMenu(e, x) } : {})}
                        >
                            <ListItemText sx={{ textAlign: 'left' }}>{x.Title}</ListItemText>
                            {/* <IconButton onClick={() => handleCopyToClipboard(x)}>
                                <ContentCopy fontSize="small" />
                            </IconButton> */}
                        </ListItemButton>
                    ))}
                {!delayLoadingSearch && !isLoadingSearch && !dataSearch?.length && (
                    <ListItem>
                        <ListItemText sx={{ textAlign: 'center' }}>
                            No match concept.{' '}
                            <Link sx={{ cursor: 'pointer' }} onClick={handleAdd}>
                                Add?
                            </Link>
                        </ListItemText>
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

    return (
        <Box
            sx={{
                overflowX: 'hidden',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                pb: 0,
                flex: 1,
            }}
        >
            {Content}
        </Box>
    );
}

export default memo(ListSearchConcept);
