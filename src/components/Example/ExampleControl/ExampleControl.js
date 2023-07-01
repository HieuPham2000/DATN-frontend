import { memo } from 'react';
import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function ExampleControl({ sx = {} }) {
    const { control } = useFormContext();
    return (
        <Controller
            name="example"
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    id="txtExample"
                    label="Example (*)"
                    fullWidth
                    multiline
                    rows={6}
                    inputProps={{ maxLength: 1000 }}
                    autoComplete="off"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...field}
                    sx={sx}
                    error={!!error?.message}
                    title={error?.message}
                    helperText={error?.message}
                    onFocus={(event) => {
                        event.target.select();
                    }}
                />
            )}
        />
    );
}

export default memo(ExampleControl);
