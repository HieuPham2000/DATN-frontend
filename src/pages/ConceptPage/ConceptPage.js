import { Helmet } from 'react-helmet-async';
import styles from './ConceptPage.module.scss';
import classNames from 'classnames/bind';
import { Autocomplete, Box, Button, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AddConceptDialog from '~/components/Concept/AddConceptDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import ListSearchConcept from '~/components/Concept/ListSearchConcept/ListSearchConcept';
import { getListConceptLink } from '~/services/userConfigService';
import { LoadingButton } from '@mui/lab';
import { getConceptRelationship, updateConceptRelationship } from '~/services/conceptService';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';
import { East } from '@mui/icons-material';
import AlertDialog from '~/components/BaseComponent/AlertDialog';
import useAccountInfo from '~/hooks/data/useAccountInfo';

const cx = classNames.bind(styles);

function ConceptPage() {
    const queryClient = useQueryClient();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    const [relation, setRelation] = useState(null);
    const [relationInputValue, setRelationInputValue] = useState('');
    const [isForcedUpdate, setForcedUpdate] = useState(false);
    const [childSearchValue, setChildSearchValue] = useState('');
    const [delaySearchChild, setDelaySearchChild] = useState(700);

    const { data: accountInfo } = useAccountInfo();
    const dictionaryName = useMemo(() => accountInfo?.Dictionary?.DictionaryName ?? '', [accountInfo]);

    /**
     * Lấy danh sách concept link
     */
    const { data: lstConceptLink, isLoading: isLoadingConceptLink } = useQuery({
        queryKey: ['listConceptLink'],
        queryFn: async () => {
            const res = await getListConceptLink();
            return res.data.Data;
        },
        staleTime: 30000,
    });

    /**
     * Lấy MQH concept - concept
     */
    const { data: conceptRelationship, isLoading: isLoadingGetRelation } = useQuery({
        queryKey: ['conceptRelationship', selectedChild?.ConceptId, selectedParent?.ConceptId],
        queryFn: async () => {
            const res = await getConceptRelationship(selectedChild?.ConceptId, selectedParent?.ConceptId);
            return res.data.Data;
        },
        enabled: !!selectedChild?.ConceptId && !!selectedParent?.ConceptId,
    });

    /**
     * Lưu thiết lập
     */
    const { mutate: updateRelation, isLoading: isLoadingUpdate } = useMutation(
        async () => {
            let relationItem = lstConceptLink.find((x) => x.ConceptLinkName === relation);
            const res = await updateConceptRelationship(
                selectedChild?.ConceptId,
                selectedParent?.ConceptId,
                relationItem?.ConceptLinkId,
                isForcedUpdate, // cưỡng chế cập nhật (loại bỏ circle link)
            );
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');

                    let logDescription = '';

                    if (isForcedUpdate) {
                        setForcedUpdate(false);
                        logDescription += `Remove the link from "${selectedParent?.Title || ''}" to "${
                            selectedChild?.Title || ''
                        }". `;

                        setOpenAlert(false);
                    }

                    logDescription = `Update link from "${selectedChild?.Title || ''}" to "${
                        selectedParent?.Title || ''
                    }" to "${relation}"`;

                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.Concept,
                        ActionType: HUSTConstant.LogAction.UpdateConceptRelationship.Type,
                        Reference: `Dictionary: ${dictionaryName}`,
                        Description: logDescription,
                    };

                    saveLog(logParam);

                    queryClient.invalidateQueries([
                        'conceptRelationship',
                        selectedChild?.ConceptId,
                        selectedParent?.ConceptId,
                    ]);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    if (data.ErrorCode === HUSTConstant.ErrorCode.Err3004) {
                        setOpenAlert(true);
                        toast.warning(data.Message);
                    } else {
                        toast.error(data.Message || 'Update failed');
                    }
                } else {
                    toast.error('Update failed');
                }
            },
        },
    );

    // ---------------------------------------------------------------

    useEffect(() => {
        setRelation(conceptRelationship?.ConceptLinkName || 'No link');
    }, [conceptRelationship]);

    const conceptLinkOptions = useMemo(() => lstConceptLink?.map((x) => x.ConceptLinkName) || [], [lstConceptLink]);

    // ----------------------------------------------------------------

    const handleAdd = () => {
        setOpenAddDialog(true);
    };

    const handleAfterAddSuccess = (newConceptTitle) => {
        setDelaySearchChild(0);
        setChildSearchValue(newConceptTitle);
        queryClient.invalidateQueries(['searchConcept']);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleUpdate = () => {
        setForcedUpdate(false);
        updateRelation();
    };

    const handleForceUpdate = () => {
        setForcedUpdate(true);
        updateRelation();
    };

    return (
        <div className={cx('wrapper')}>
            {openAlert && (
                <AlertDialog
                    title="Concept link"
                    content={`"${selectedChild?.Title}" is currently linked to "${selectedParent?.Title}" as a parent. Change the direction accordingly?`}
                    open={openAlert}
                    onClose={handleCloseAlert}
                >
                    <Button color="minor" size="large" onClick={handleCloseAlert}>
                        Cancel
                    </Button>
                    <Button size="large" onClick={handleForceUpdate}>
                        Change
                    </Button>
                </AlertDialog>
            )}
            {openAddDialog && (
                <AddConceptDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    handleAfter={handleAfterAddSuccess}
                />
            )}
            <Helmet>
                <title>Concept | HUST PVO</title>
            </Helmet>
            <div className={cx('toolbar-wrapper')}>
                <Typography variant="h4">Concept</Typography>
                <Button sx={{ display: 'inline-block', minWidth: 100 }} variant="contained" onClick={handleAdd}>
                    Add
                </Button>
            </div>
            <div className={cx('main-wrapper')}>
                <Paper sx={{ ...stylePaper, p: 2, pt: 1, m: 1, mb: 2 }} className={cx('main-item')}>
                    <ListSearchConcept
                        labelText="Search child"
                        selectedRow={selectedChild}
                        setSelectedRow={setSelectedChild}
                        defaultSearchValue={childSearchValue}
                        delaySearch={delaySearchChild}
                        setDelaySearch={setDelaySearchChild}
                    />
                </Paper>
                <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }} className={cx('main-item')}>
                    <Box className={cx('arrow-wrapper')} color="primary.main">
                        <Tooltip title={selectedChild?.Title || 'Child'}>
                            <Typography className={cx('text-arrow')}>{selectedChild?.Title || 'Child'}</Typography>
                        </Tooltip>

                        <East sx={{ flex: 1 }} className={cx('arrow')} />
                        <Tooltip title={selectedParent?.Title || 'Parent'}>
                            <Typography className={cx('text-arrow')} textAlign="right">
                                {selectedParent?.Title || 'Parent'}
                            </Typography>
                        </Tooltip>
                    </Box>
                    <Autocomplete
                        id="txtRelation"
                        options={conceptLinkOptions}
                        selectOnFocus
                        handleHomeEndKeys
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{ ...params.inputProps, maxLength: 255 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label="Relation"
                            />
                        )}
                        loading={isLoadingConceptLink}
                        sx={{ mt: 2 }}
                        value={relation || null}
                        onChange={(_, newValue) => {
                            setRelation(newValue);
                        }}
                        inputValue={relationInputValue}
                        onInputChange={(_, newInputValue) => {
                            setRelationInputValue(newInputValue);
                        }}
                        disabled={selectedChild?.ConceptId === selectedParent?.ConceptId}
                    />
                    <LoadingButton
                        sx={{ mt: 2, display: 'inline-block', minWidth: 100 }}
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleUpdate}
                        loading={isLoadingUpdate}
                        disabled={
                            isLoadingGetRelation ||
                            relation === conceptRelationship?.ConceptLinkName ||
                            selectedChild?.ConceptId === selectedParent?.ConceptId
                        }
                    >
                        Save
                    </LoadingButton>
                </Paper>
                <Paper sx={{ ...stylePaper, p: 2, pt: 1, m: 1, mb: 2 }} className={cx('main-item')}>
                    <ListSearchConcept
                        labelText="Search parent"
                        selectedRow={selectedParent}
                        setSelectedRow={setSelectedParent}
                    />
                </Paper>
            </div>
        </div>
    );
}

export default ConceptPage;
