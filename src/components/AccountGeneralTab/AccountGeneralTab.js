import classNames from 'classnames/bind';
import styles from './AccountGeneralTab.module.scss';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, updateUserInfo } from '~/services/userService';
import { Enum } from '~/utils/common/enumeration';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading';
import { DatePicker } from '@mui/x-date-pickers';
import { FormatDate } from '~/utils/common/config';
import moment from 'moment';
import { BaseUploadAvatarControl } from '~/components/BaseComponent/BaseUploadControl';
import { formatData } from '~/utils/common/utils';
import HUSTConstant from '~/utils/common/constant';
import { saveLog } from '~/services/auditLogService';

const cx = classNames.bind(styles);

const stylePaper = (theme) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#212b36',
    boxShadow:
        theme.palette.mode === 'light'
            ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
            : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
    zIndex: 0,
    backgroundImage: 'none',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
});

function AccountGeneralTab() {
    const queryClient = useQueryClient();
    const { data: userInfo } = useQuery({
        queryKey: ['userGeneralInfo'],
        queryFn: async () => {
            const res = await getUserInfo();
            return res.data.Data;
        },
    });

    const convertUserInfo = useMemo(() => {
        return {
            avatarLink: userInfo?.Avatar ?? '',
            userAccount: userInfo?.UserName ?? '',
            email: userInfo?.Email ?? '',
            fullName: userInfo?.FullName ?? '',
            displayName: userInfo?.DisplayName ?? '',
            birthday: userInfo?.Birthday ? moment(userInfo?.Birthday) : null,
            position: userInfo?.Position ?? '',
        };
    }, [userInfo]);

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { isDirty, dirtyFields },
    } = useForm({
        mode: 'onSubmit',
        // defaultValues: {
        //     userAccount: '',
        //     email: '',
        //     fullName: '',
        //     displayName: '',
        //     birthday: null,
        //     position: '',
        // },
        defaultValues: convertUserInfo,
    });

    const avatar = useWatch({
        control,
        name: 'avatarLink',
    });

    useEffect(() => {
        setValue('avatarLink', userInfo?.Avatar ?? '');
        setValue('userAccount', userInfo?.UserName ?? '');
        setValue('email', userInfo?.Email ?? '');
        setValue('fullName', userInfo?.FullName ?? '');
        setValue('displayName', userInfo?.DisplayName ?? '');
        setValue('birthday', userInfo?.Birthday ? moment(userInfo?.Birthday) : null); // null hay undefined
        setValue('position', userInfo?.Position ?? '');
    }, [userInfo, setValue]);

    /**
     * Call api save
     */
    const { mutate: handleSave, isLoading: isLoadingSave } = useMutation(
        async (data) => {
            // console.log(data);
            let param = {
                Avatar: data.avatarLink,
                FullName: data.fullName?.trim(),
                DisplayName: data.displayName?.trim(),
                Birthday: moment.isMoment(data.birthday) ? data.birthday.toISOString() : null,
                Position: data.position?.trim(),
            };
            const res = await updateUserInfo(param);
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success) {
                    toast.success('Update successfully');

                    let logDescription = 'Change information: ';
                    avatar !== convertUserInfo.avatarLink && (logDescription += 'Avatar, ');
                    dirtyFields.fullName && (logDescription += 'Full Name, ');
                    dirtyFields.displayName && (logDescription += 'Display Name, ');
                    dirtyFields.birthday && (logDescription += 'Birthday, ');
                    dirtyFields.position && (logDescription += 'Position, ');
                    logDescription = logDescription.slice(0, -2);
                    let logParam = {
                        ScreenInfo: HUSTConstant.ScreenInfo.AccountSettingGeneralTab,
                        ActionType: HUSTConstant.LogAction.ChangeInfo.Type,
                        Description: logDescription,
                    };
                    saveLog(logParam);

                    queryClient.invalidateQueries(['userGeneralInfo']);
                    queryClient.invalidateQueries(['accountInfo']);
                } else if (data?.Status === Enum.ServiceResultStatus.Fail) {
                    toast.error(data.Message || 'Update failed');
                } else {
                    toast.error('Update failed');
                }
            },
        },
    );

    const handleCancel = () => {
        reset(convertUserInfo);
    };

    const handleUpload = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('avatarLink', newFile);
            }
        },
        [setValue],
    );

    const hasChange = useMemo(() => {
        return isDirty || avatar !== convertUserInfo.avatarLink;
    }, [isDirty, avatar, convertUserInfo]);

    return (
        <div className={cx('wrapper')}>
            {isLoadingSave && <Loading />}
            <Paper sx={stylePaper}>
                <BaseUploadAvatarControl
                    name="avatarLink"
                    control={control}
                    maxSize={HUSTConstant.MaxFileSize.Image}
                    onDrop={handleUpload}
                    helperText={
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 3,
                                mx: 'auto',
                                display: 'block',
                                textAlign: 'center',
                                color: 'text.disabled',
                            }}
                        >
                            Allowed *.jpeg, *.jpg, *.png
                            <br /> max size of {formatData(HUSTConstant.MaxFileSize.Image)}
                        </Typography>
                    }
                />
            </Paper>
            <Paper sx={stylePaper}>
                <Box className={cx('content-wrapper')}>
                    <Controller
                        name="userAccount"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="txtUserAccount"
                                label="User Account"
                                fullWidth
                                inputProps={{ maxLength: 50 }}
                                {...field}
                                disabled
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="txtEmail"
                                type="email"
                                label="Email Address"
                                fullWidth
                                inputProps={{ maxLength: 50 }}
                                {...field}
                                disabled
                            />
                        )}
                    />
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="txtFullName"
                                label="Full Name"
                                fullWidth
                                inputProps={{ maxLength: 255 }}
                                {...field}
                                autoFocus
                            />
                        )}
                    />
                    <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="txtDisplayName"
                                label="Display Name"
                                fullWidth
                                inputProps={{ maxLength: 100 }}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="birthday"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="Birthday"
                                format={FormatDate}
                                dayOfWeekFormatter={(day) => `${day}.`}
                                views={['year', 'month', 'day']}
                                showDaysOutsideCurrentMonth
                                maxDate={moment()}
                                slotProps={{
                                    actionBar: {
                                        actions: ['clear'],
                                    },
                                    popper: {
                                        placement: 'auto',
                                    },
                                }}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="txtPosition"
                                label="Job"
                                fullWidth
                                inputProps={{ maxLength: 255 }}
                                {...field}
                            />
                        )}
                    />
                </Box>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {hasChange && (
                        <Button
                            sx={{ mt: 2, mr: 2, display: 'inline-block', minWidth: 100 }}
                            variant="outline"
                            size="large"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}
                    <LoadingButton
                        sx={{ mt: 2, display: 'inline-block', minWidth: 100 }}
                        variant="contained"
                        size="large"
                        onClick={handleSubmit(handleSave)}
                        loading={isLoadingSave}
                        disabled={!hasChange}
                    >
                        Save
                    </LoadingButton>
                </div>
            </Paper>
        </div>
    );
}

export default memo(AccountGeneralTab);
