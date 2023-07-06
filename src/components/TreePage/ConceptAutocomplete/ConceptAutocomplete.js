import { memo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { searchConcept } from '~/services/conceptService';

function ConceptAutocomplete({ selectedConcept, setSelectedConcept, autoFocus, fullWidth }) {
    const [inputValue, setInputValue] = useState('');
    const { data: listConcept, isLoading: isLoadingConcept } = useQuery({
        queryKey: ['searchConcept', ''],
        queryFn: async () => {
            const res = await searchConcept({
                searchKey: '',
            });
            return res.data.Data;
        },
    });

    return (
        <Autocomplete
            size="small"
            id="concept-option"
            options={listConcept || []}
            getOptionLabel={(option) => option.Title}
            isOptionEqualToValue={(option, value) => option?.Title === value?.Title}
            selectOnFocus
            handleHomeEndKeys
            fullWidth={fullWidth}
            renderInput={(params) => (
                <TextField
                    label="Concept"
                    {...params}
                    inputProps={{ ...params.inputProps, maxLength: 50 }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoadingConcept ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    autoFocus={autoFocus}
                />
            )}
            loading={isLoadingConcept}
            value={selectedConcept || null}
            onChange={(_, newValue) => {
                setSelectedConcept(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
        />
    );
}

export default memo(ConceptAutocomplete);
