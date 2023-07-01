import { memo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function ExampleAttributeControl({ name, label, options, isLoading, getOptionLabel, isOptionEqualToValue, sx = {} }) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    size="small"
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
                    onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
                    {...(!!getOptionLabel ? { getOptionLabel } : {})}
                    {...(!!isOptionEqualToValue ? { isOptionEqualToValue } : {})}
                />
            )}
        />
    );
}

export default memo(ExampleAttributeControl);
