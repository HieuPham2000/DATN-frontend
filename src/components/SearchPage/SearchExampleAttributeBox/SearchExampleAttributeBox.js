import { memo, useMemo } from 'react';
import { Box, Paper, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { useQuery } from '@tanstack/react-query';
import { getListExampleAttribute } from '~/services/userConfigService';
import ExampleAttributeControl from '~/components/Example/ExampleAttributeControl';
import classNames from 'classnames/bind';
import styles from './SearchExampleAttributeBox.module.scss';

const cx = classNames.bind(styles);

function SearchExampleAttributeBox() {
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
        //     let tmpListTone = [{ ToneId: null, ToneName: 'All' }, ...(data?.ListTone || [])],
        //         tmpListMode = [{ ModeId: null, ModeName: 'All' }, ...(data?.ListMode || [])],
        //         tmpListRegister = [{ RegisterId: null, RegisterName: 'All' }, ...(data?.ListRegister || [])],
        //         tmpListNuance = [{ NuanceId: null, NuanceName: 'All' }, ...(data?.ListNuance || [])],
        //         tmpListDialect = [{ DialectId: null, DialectName: 'All' }, ...(data?.ListDialect || [])];

        //     setListTone(tmpListTone);
        //     setListMode(tmpListMode);
        //     setListRegister(tmpListRegister);
        //     setListNuance(tmpListNuance);
        //     setListDialect(tmpListDialect);
        // },
        staleTime: 30000,
    });

    const listTone = useMemo(() => [{ ToneId: null, ToneName: 'All' }, ...(dataAttr?.ListTone || [])], [dataAttr]);
    const listMode = useMemo(() => [{ ModeId: null, ModeName: 'All' }, ...(dataAttr?.ListMode || [])], [dataAttr]);
    const listRegister = useMemo(
        () => [{ RegisterId: null, RegisterName: 'All' }, ...(dataAttr?.ListRegister || [])],
        [dataAttr],
    );
    const listNuance = useMemo(
        () => [{ NuanceId: null, NuanceName: 'All' }, ...(dataAttr?.ListNuance || [])],
        [dataAttr],
    );
    const listDialect = useMemo(
        () => [{ DialectId: null, DialectName: 'All' }, ...(dataAttr?.ListDialect || [])],
        [dataAttr],
    );

    return (
        <>
            <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }} className={cx('main-item')}>
                <Controller
                    name="keyword"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="txtKeyword"
                            label="Keyword"
                            fullWidth
                            multiline
                            maxRows={6}
                            minRows={4}
                            inputProps={{ maxLength: 1000 }}
                            autoComplete="off"
                            placeholder="Enter search keywords"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...field}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            autoFocus
                        />
                    )}
                />
            </Paper>
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
        </>
    );
}

export default memo(SearchExampleAttributeBox);
