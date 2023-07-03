import { memo } from 'react';
import { Autocomplete, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { useQuery } from '@tanstack/react-query';
import { searchConcept } from '~/services/conceptService';
import { Info } from '@mui/icons-material';

function SearchLinkedConceptAutocomplete({ limit }) {
    const { control, setValue } = useFormContext();

    const listLinkedConcept = useWatch({
        control,
        name: 'listLinkedConcept',
    });

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
        <Paper sx={{ ...stylePaper, p: 2, m: 1, mb: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Info fontSize="small" color="text.secondary" sx={{ mr: 0.2, pb: 0.2 }} />
                    Limit to choose {limit} linked concepts
                </Typography>
            </div>

            <Controller
                name="listLinkedConcept"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        multiple
                        id="linkedConcept"
                        options={listConcept || []}
                        getOptionLabel={(option) => option.Title}
                        isOptionEqualToValue={(option, value) => option?.Title === value?.Title}
                        filterSelectedOptions
                        loading={isLoadingConcept}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Linked concepts"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingConcept ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        onChange={(_, newValue) => setValue('listLinkedConcept', newValue, { shouldValidate: true })}
                        getOptionDisabled={(options) => (listLinkedConcept.length >= limit ? true : false)} // limit chọn tối đa
                    />
                )}
            />
        </Paper>
    );
}

export default memo(SearchLinkedConceptAutocomplete);
