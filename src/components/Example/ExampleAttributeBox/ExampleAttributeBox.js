import { memo, useMemo } from 'react';
import { Box, Paper, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { useQuery } from '@tanstack/react-query';
import { getListExampleAttribute } from '~/services/userConfigService';
import ExampleAttributeControl from '~/components/Example/ExampleAttributeControl';
import classNames from 'classnames/bind';
import styles from './ExampleAttributeBox.module.scss';

const cx = classNames.bind(styles);
function ExampleAttributeBox() {
    const { control } = useFormContext();
    // const [listTone, setListTone] = useState([]);
    // const [listMode, setListMode] = useState([]);
    // const [listRegister, setListRegister] = useState([]);
    // const [listNuance, setListNuance] = useState([]);
    // const [listDialect, setListDialect] = useState([]);

    const { data: dataAttr, isLoading: isLoadingExampleAttrs } = useQuery({
        queryKey: ['listExampleAttribute'],
        queryFn: async () => {
            const res = await getListExampleAttribute();
            return res.data.Data;
        },
        // onSuccess: (data) => {
        //     setListTone(data?.ListTone || []);
        //     setListMode(data?.ListMode || []);
        //     setListRegister(data?.ListRegister || []);
        //     setListNuance(data?.ListNuance || []);
        //     setListDialect(data?.ListDialect || []);
        // },
        staleTime: 30000,
    });

    const listTone = useMemo(() => dataAttr?.ListTone || [], [dataAttr]);
    const listMode = useMemo(() => dataAttr?.ListMode || [], [dataAttr]);
    const listRegister = useMemo(() => dataAttr?.ListRegister || [], [dataAttr]);
    const listNuance = useMemo(() => dataAttr?.ListNuance || [], [dataAttr]);
    const listDialect = useMemo(() => dataAttr?.ListDialect || [], [dataAttr]);

    return (
        <>
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }} className={cx('main-item')}>
                <Box className={cx('example-attr-wrapper')}>
                    <ExampleAttributeControl
                        name="tone"
                        label="Tone"
                        isLoading={isLoadingExampleAttrs}
                        options={listTone}
                        getOptionLabel={(option) => option?.ToneName || ''}
                        isOptionEqualToValue={(option, value) => option?.ToneName === value?.ToneName}
                    />
                    <ExampleAttributeControl
                        name="mode"
                        label="Mode"
                        isLoading={isLoadingExampleAttrs}
                        options={listMode}
                        getOptionLabel={(option) => option?.ModeName || ''}
                        isOptionEqualToValue={(option, value) => option?.ModeName === value?.ModeName}
                    />
                    <ExampleAttributeControl
                        name="register"
                        label="Register"
                        isLoading={isLoadingExampleAttrs}
                        options={listRegister}
                        getOptionLabel={(option) => option?.RegisterName || ''}
                        isOptionEqualToValue={(option, value) => option?.RegisterName === value?.RegisterName}
                    />
                    <ExampleAttributeControl
                        name="nuance"
                        label="Nuance"
                        isLoading={isLoadingExampleAttrs}
                        options={listNuance}
                        getOptionLabel={(option) => option?.NuanceName || ''}
                        isOptionEqualToValue={(option, value) => option?.NuanceName === value?.NuanceName}
                    />
                    <ExampleAttributeControl
                        name="dialect"
                        label="Dialect"
                        isLoading={isLoadingExampleAttrs}
                        options={listDialect}
                        getOptionLabel={(option) => option?.DialectName || ''}
                        isOptionEqualToValue={(option, value) => option?.DialectName === value?.DialectName}
                    />
                </Box>
            </Paper>
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }} className={cx('main-item')}>
                <Controller
                    name="note"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            id="txtNote"
                            label="Notes"
                            fullWidth
                            multiline
                            maxRows={6}
                            minRows={4}
                            inputProps={{ maxLength: 1000 }}
                            autoComplete="off"
                            placeholder="Provide sources, translation, or additional notes (if any)..."
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...field}
                            error={!!error?.message}
                            title={error?.message}
                            helperText={error?.message}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                        />
                    )}
                />
            </Paper>
        </>
    );
}

export default memo(ExampleAttributeBox);
