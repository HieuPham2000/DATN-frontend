import classNames from 'classnames/bind';
import styles from './DictionaryItem.module.scss';
import {
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { memo, useRef, useState } from 'react';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import dictionaryImg from '~/assets/images/dictionary.png';
import { CloudDownload, Delete, DriveFileMove, Edit, ImportContacts, Input, MoreVert } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loadDictionary as loadDictionaryService } from '~/services/dictionaryService';
import HUSTConstant from '~/utils/common/constant';
import { toast } from 'react-toastify';
import { Enum } from '~/utils/common/enumeration';
import { saveLog } from '~/services/auditLogService';
import { setUserSession } from '~/utils/httpRequest';
import { formatDateTime } from '~/utils/common/utils';
import EditDictionaryDialog from '~/components/Dictionary/EditDictionaryDialog';
import DeleteDictionaryDialog from '~/components/Dictionary/DeleteDictionaryDialog';

const cx = classNames.bind(styles);
function DictionaryItem({ id, name, lastViewAt, active }) {
    const actionBtn = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const queryClient = useQueryClient();
    const { mutate: loadDict } = useMutation(
        async () => {
            const res = await loadDictionaryService(id);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Load successfully');
                    setUserSession(data.Data.SessionId);
                    queryClient.setQueryData(['isAuthenticate'], true);

                    let logDescription = `Load: ${name}`;
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Dictionary,
                        ActionType: HUSTConstant.LogAction.LoadDictionary.Type,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    queryClient.invalidateQueries(['listDictionary']);
                    queryClient.invalidateQueries(['accountInfo']);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Load failed');
                } else {
                    toast.error('Load failed');
                }
            },
        },
    );

    const handleShowMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickMore = (event) => {
        handleShowMenu(event);
    };

    const handleDbClickDictionary = () => {
        handleLoad();
    };

    // const handleClickDictionary = () => {
    //     setAnchorEl(actionBtn.current);
    // };

    const handleLoad = () => {
        loadDict();
        handleClose();
    };

    const handleEdit = () => {
        setOpenEditDialog(true);
        handleClose();
    };

    const handleDelete = () => {
        setOpenDeleteDialog(true);
        handleClose();
    };

    return (
        <Paper
            sx={{
                ...stylePaper,
                transition: (theme) =>
                    theme.transitions.create(['opacity'], {
                        duration: theme.transitions.duration.shorter,
                    }),
            }}
            className={cx('wrapper', { active: active })}
        >
            <EditDictionaryDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                dictId={id}
                dictName={name}
            />
            <DeleteDictionaryDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                dictId={id}
                dictName={name}
            />
            <Tooltip title={name}>
                <Box
                    className={cx('content-wrapper')}
                    onDoubleClick={handleDbClickDictionary}
                    // onClick={handleClickDictionary}
                >
                    <IconButton
                        className={cx('btn-more')}
                        aria-label="more"
                        aria-controls={open ? 'actions menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClickMore}
                        ref={actionBtn}
                    >
                        <MoreVert />
                    </IconButton>

                    <img src={dictionaryImg} alt="dictionary" className={cx('dict-img')}></img>
                    <Typography
                        sx={{
                            mt: 2,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 5,
                        }}
                    >
                        {name}
                    </Typography>
                    {!active && lastViewAt && (
                        <Typography variant="caption">{`(Last view: ${formatDateTime(lastViewAt)})`}</Typography>
                    )}
                    {active && <Typography variant="caption">(Current dictionary)</Typography>}
                </Box>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {!active && (
                    <MenuItem onClick={handleLoad}>
                        <ListItemIcon>
                            <ImportContacts fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Load</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Input fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Import</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <CloudDownload fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DriveFileMove fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Transfer</ListItemText>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ClearAll fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Empty</ListItemText>
                </MenuItem> */}
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Paper>
    );
}

export default memo(DictionaryItem);
