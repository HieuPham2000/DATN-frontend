import { Box, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Enum } from '~/utils/common/enumeration';
import { LoadingButton } from '@mui/lab';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { Search } from '@mui/icons-material';
import { getFreeDictionaryApiResult, getWordsApiResult } from '~/services/helperService';
import HUSTConstant from '~/utils/common/constant';
import SourceApiRadioGroup from '~/components/Helper/LookupTab/SourceApiRadioGroup';
import ViewResultFreeDictionaryApi from '~/components/Helper/LookupTab/ViewResultFreeDictionaryApi';
import ViewResultWordsApi from '~/components/Helper/LookupTab/ViewResultWordsApi';

function LookupTab() {
    // ======================================================================
    const [searchValue, setSearchValue] = useState('');
    const [sourceApi, setSourceApi] = useState(HUSTConstant.SourceApiDictionary.FreeDictionaryApi);
    const [result, setResult] = useState(null);

    useEffect(() => {
        setResult(null);
    }, [sourceApi]);

    // =======================================================================

    const { mutate: getDataFreeDictionaryApi, isLoading: isLoadingSearch1 } = useMutation(
        async () => {
            const res = await getFreeDictionaryApiResult(searchValue?.trim());
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success && data.Data.content) {
                    setResult(data.Data);
                } else {
                    setResult(null);
                }
            },
        },
    );

    const { mutate: getDataWordsApi, isLoading: isLoadingSearch2 } = useMutation(
        async () => {
            const res = await getWordsApiResult(searchValue?.trim());
            return res.data;
        },
        {
            onSuccess: (data) => {
                if (data?.Status === Enum.ServiceResultStatus.Success && data.Data && data.Data.success !== false) {
                    setResult(data.Data);
                } else {
                    setResult(null);
                }
            },
        },
    );

    // ====================================================================

    const handleClickSearch = () => {
        switch (sourceApi) {
            case HUSTConstant.SourceApiDictionary.FreeDictionaryApi:
                getDataFreeDictionaryApi();
                break;
            case HUSTConstant.SourceApiDictionary.WordsApi:
                getDataWordsApi();
                break;
            default:
                break;
        }
    };

    // ==============================================================

    return (
        <div>
            <Box>
                <SourceApiRadioGroup value={sourceApi} setValue={setSourceApi} />
            </Box>
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <TextField
                    id="txtSearch"
                    label="Search"
                    placeholder="Enter 1 word/phrase"
                    size="small"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    inputProps={{ maxLength: 100 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
                <LoadingButton
                    sx={{ display: 'inline-block', minWidth: 100, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
                    variant="contained"
                    onClick={handleClickSearch}
                    loading={isLoadingSearch1 || isLoadingSearch2}
                    disabled={!searchValue}
                >
                    Search
                </LoadingButton>
            </Box>
            <Paper sx={{ ...stylePaper, p: 2, m: 2 }}>
                {!result && <Typography>No data</Typography>}
                {!!result && sourceApi === HUSTConstant.SourceApiDictionary.FreeDictionaryApi && (
                    <ViewResultFreeDictionaryApi result={result} />
                )}
                {!!result && sourceApi === HUSTConstant.SourceApiDictionary.WordsApi && (
                    <ViewResultWordsApi result={result} />
                )}
            </Paper>
        </div>
    );
}

export default memo(LookupTab);
