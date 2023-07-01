import { memo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

function ExampleAttributeAutocomplete({ id, label, value, setValue, options, isLoading, sx = {} }) {
    const [inputValue, setInputValue] = useState('');
    return (
        <Autocomplete
            size="small"
            id={id}
            options={options || []}
            selectOnFocus
            handleHomeEndKeys
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputProps={{ ...params.inputProps, maxLength: 50 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label={label}
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
        />
    );
}

export default memo(ExampleAttributeAutocomplete);
