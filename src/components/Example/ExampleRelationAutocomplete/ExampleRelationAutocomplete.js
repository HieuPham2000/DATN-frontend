import { memo, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getListExampleAttribute } from '~/services/userConfigService';

function ExampleRelationAutocomplete({ value, setValue, disabled, sx = {} }) {
    const [inputValue, setInputValue] = useState('');

    const { data: exampleAttrs, isLoading } = useQuery({
        queryKey: ['listExampleAttribute'],
        queryFn: async () => {
            const res = await getListExampleAttribute();
            return res.data.Data;
        },
        staleTime: 30000,
    });

    const listExampleLink = useMemo(() => exampleAttrs?.ListExampleLink || [], [exampleAttrs]);
    return (
        <Autocomplete
            id="txtRelation"
            options={listExampleLink || []}
            selectOnFocus
            handleHomeEndKeys
            fullWidth
            size="small"
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputProps={{ ...params.inputProps, maxLength: 50 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Relation"
                />
            )}
            loading={isLoading}
            sx={sx}
            value={value || null}
            onChange={(_, newValue) => {
                setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option?.ExampleLinkName || ''}
            isOptionEqualToValue={(option, value) => option?.ExampleLinkName === value?.ExampleLinkName}
            disabled={disabled}
        />
    );
}

export default memo(ExampleRelationAutocomplete);
