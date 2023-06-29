import { Helmet } from 'react-helmet-async';
import styles from './AuditLogPage.module.scss';
import classNames from 'classnames/bind';
import {
    Box,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { useMemo, useRef, useState } from 'react';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { useQuery } from '@tanstack/react-query';
import { getLogs } from '~/services/auditLogService';
import emptyImg from '~/assets/images/empty.svg';
import { formatDateTime, getMapLogActionType } from '~/utils/common/utils';
import { Search } from '@mui/icons-material';
import useDebounce from '~/hooks/useDebounce';
import moment from 'moment';
import { FormatDate } from '~/utils/common/config';
import { DatePicker } from '@mui/x-date-pickers';

const cx = classNames.bind(styles);

function AuditLogPage() {
    const mapLogActionType = useRef(getMapLogActionType());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [dateFrom, setDateFrom] = useState(moment().startOf('day'));
    const [dateTo, setDateTo] = useState(moment().endOf('day'));

    const searchKey = useDebounce(searchValue, 500);
    const convertedDateFrom = useMemo(() => moment(dateFrom).toISOString(), [dateFrom]);
    const convertedDateTo = useMemo(() => moment(dateTo).toISOString(), [dateTo]);

    const { data } = useQuery({
        queryKey: ['auditLog', page, rowsPerPage, searchKey, convertedDateFrom, convertedDateTo],
        queryFn: async () => {
            let pageIndex = page * rowsPerPage;
            const res = await getLogs({
                pageIndex,
                pageSize: rowsPerPage,
                searchFilter: searchKey,
                dateFrom: convertedDateFrom,
                dateTo: convertedDateTo,
            });
            return res.data.Data;
        },
        keepPreviousData: true,
    });

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = data?.Data?.length && page > 0 ? Math.max(0, rowsPerPage - data.Data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Access History | HUST PVO</title>
            </Helmet>
            <Typography variant="h4">Access History</Typography>
            <Box className={cx('toolbar-wrapper')} sx={{ mx: 1, mt: 2 }}>
                <div className={cx('toolbar-date-wrapper')}>
                    <DatePicker
                        label="From"
                        format={FormatDate}
                        dayOfWeekFormatter={(day) => `${day}.`}
                        views={['year', 'month', 'day']}
                        showDaysOutsideCurrentMonth
                        maxDate={dateTo}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                            popper: {
                                placement: 'auto',
                            },
                            textField: {
                                size: 'small',
                            },
                        }}
                        value={dateFrom}
                        onChange={(value) => setDateFrom(value)}
                    />
                    <DatePicker
                        label="To"
                        format={FormatDate}
                        dayOfWeekFormatter={(day) => `${day}.`}
                        views={['year', 'month', 'day']}
                        showDaysOutsideCurrentMonth
                        minDate={dateFrom}
                        maxDate={moment()}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                            popper: {
                                placement: 'auto',
                            },
                            textField: {
                                size: 'small',
                            },
                        }}
                        value={dateTo}
                        onChange={(value) => setDateTo(value)}
                    />
                </div>

                <TextField
                    id="txtSearch"
                    label="Search keywords"
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
                    onFocus={(event) => {
                        event.target.select();
                    }}
                />
            </Box>
            <Paper sx={{ ...stylePaper, mx: 1, mt: 2, mb: 3, flex: 1, display: 'flex', overflow: 'auto' }}>
                <Table stickyHeader aria-label="access history table" sx={{ minWidth: 800 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Date time</TableCell>
                            <TableCell>Screen</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Reference</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!!data?.Data?.length &&
                            data.Data.map((row, index) => (
                                <TableRow hover key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">{formatDateTime(row.CreatedDate)}</TableCell>
                                    <TableCell>{row.ScreenInfo}</TableCell>
                                    <TableCell>{mapLogActionType.current[row.ActionType]}</TableCell>
                                    <TableCell>{row.Reference}</TableCell>
                                    <TableCell>{row.Description}</TableCell>
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={5} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {data?.TotalRecords === 0 && (
                    <div className={cx('empty-img-wrapper')}>
                        <img alt="empty data" src={emptyImg} width={1} height={1} />
                    </div>
                )}
            </Paper>
            {!!data?.TotalRecords && (
                <TablePagination
                    component="div"
                    sx={{ border: 'none' }}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    count={data.TotalRecords}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            )}
        </div>
    );
}

export default AuditLogPage;
