import { Button, Grid, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import styles from './DictionaryPage.module.scss';
import classNames from 'classnames/bind';
import DictionaryItem from '~/components/Dictionary/DictionaryItem';
import { useQuery } from '@tanstack/react-query';
import { getListDictionary } from '~/services/dictionaryService';
import useAccountInfo from '~/hooks/data/useAccountInfo';
import { useMemo, useState } from 'react';
import AddDictionaryDialog from '~/components/Dictionary/AddDictionaryDialog';
import { Sort } from '@mui/icons-material';
import _ from 'lodash';
import HUSTConstant from '~/utils/common/constant';
import { Helmet } from 'react-helmet-async';

const cx = classNames.bind(styles);

function DictionaryPage() {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const openSort = Boolean(anchorElSort);
    const [sortBy, setSortBy] = useState(HUSTConstant.SortListDictionary.DescLastView);
    const handleOpenSortMenu = (event) => {
        setAnchorElSort(event.currentTarget);
    };
    const handleCloseSortMenu = () => {
        setAnchorElSort(null);
    };

    const { data: dictionaries } = useQuery({
        queryKey: ['listDictionary'],
        queryFn: async () => {
            const res = await getListDictionary();
            return res.data.Data;
        },
    });

    const sortedDictionaries = useMemo(() => {
        switch (sortBy) {
            case HUSTConstant.SortListDictionary.DescLastView:
                return dictionaries;
            case HUSTConstant.SortListDictionary.AscName:
                // return _.orderBy(dictionaries || [], (dict) => dict.DictionaryName.toLowerCase(), 'asc');
                return _.orderBy(dictionaries || [], 'DictionaryName', 'asc');
            default:
                return dictionaries;
        }
    }, [dictionaries, sortBy]);

    const { data: accountInfo } = useAccountInfo();
    const currentDictionary = useMemo(() => accountInfo?.Dictionary || {}, [accountInfo]);

    const handleCreate = () => {
        setOpenAddDialog(true);
    };

    const handleSortByLastView = () => {
        if (sortBy !== HUSTConstant.SortListDictionary.DescLastView) {
            setSortBy(HUSTConstant.SortListDictionary.DescLastView);
        }
        handleCloseSortMenu();
    };

    const handleSortByName = () => {
        if (sortBy !== HUSTConstant.SortListDictionary.AscName) {
            setSortBy(HUSTConstant.SortListDictionary.AscName);
        }
        handleCloseSortMenu();
    };

    return (
        <div className={cx('wrapper')}>
            <AddDictionaryDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                dictionaries={sortedDictionaries}
            />
            <Helmet>
                <title>Dictionary | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">My Dictionaries</Typography>
            <div className={cx('toolbar-wrapper')}>
                <Button
                    id="btn-sort"
                    aria-controls={openSort ? 'sort-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSort ? 'true' : undefined}
                    onClick={handleOpenSortMenu}
                    sx={{ mr: 2 }}
                >
                    <Sort />
                    Sort by
                </Button>
                <Menu
                    id="sort-menu"
                    aria-labelledby="btn-sort"
                    anchorEl={anchorElSort}
                    open={openSort}
                    onClose={handleCloseSortMenu}
                >
                    <MenuItem
                        onClick={handleSortByLastView}
                        selected={sortBy === HUSTConstant.SortListDictionary.DescLastView}
                    >
                        <ListItemText>Last view (desc)</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleSortByName} selected={sortBy === HUSTConstant.SortListDictionary.AscName}>
                        <ListItemText>Name (asc)</ListItemText>
                    </MenuItem>
                </Menu>
                <Button sx={{ display: 'inline-block', minWidth: 100 }} variant="contained" onClick={handleCreate}>
                    Create
                </Button>
            </div>
            <div>
                <Grid container spacing={4}>
                    {sortedDictionaries?.map((item) => (
                        <Grid item xs={12} sm={4} key={item.DictionaryId}>
                            <DictionaryItem
                                id={item.DictionaryId}
                                name={item.DictionaryName}
                                lastViewAt={item.LastViewAt}
                                active={item.DictionaryId === currentDictionary.DictionaryId}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default DictionaryPage;
