import { memo, useEffect, useMemo } from 'react';
import { Autocomplete, Checkbox, CircularProgress, FormControlLabel, Paper, TextField } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { useQuery } from '@tanstack/react-query';
import { searchConcept } from '~/services/conceptService';

function SearchExampleLinkedConceptBox() {
    const { control, setValue } = useFormContext();
    const isSearchUndecided = useWatch({
        control,
        name: 'isSearchUndecided',
    });

    const listLinkedConcept = useWatch({
        control,
        name: 'listLinkedConcept',
    });

    const hasLinkedConcept = useMemo(() => listLinkedConcept && listLinkedConcept.length > 0, [listLinkedConcept]);

    useEffect(() => {
        if (hasLinkedConcept) {
            setValue('isSearchUndecided', false);
        }
    }, [hasLinkedConcept, setValue]);

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
                        disabled={isSearchUndecided}
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
                    />
                )}
            />
            <Controller
                name="isSearchUndecided"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                        id="ckbSearchUndecided"
                        label="Only search undecided examples"
                        control={<Checkbox />}
                        checked={value}
                        onChange={onChange}
                        sx={{ mt: 2 }}
                        disabled={hasLinkedConcept}
                    />
                )}
            />
        </Paper>
    );
}

export default memo(SearchExampleLinkedConceptBox);
