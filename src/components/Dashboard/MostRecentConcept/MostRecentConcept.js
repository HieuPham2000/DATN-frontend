import { memo, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { getListMostRecentConcept } from '~/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

function MostRecentConcept() {
    const [limitConcept, setLimitConcept] = useState(5);

    const { data: listMostRecentConcept, isLoading } = useQuery({
        queryKey: ['getListMostRecentConcept', limitConcept],
        queryFn: async () => {
            const res = await getListMostRecentConcept(limitConcept);
            return res.data.Data;
        },
    });
    const [delayLoading, setDelayLoading] = useState(5);

    useEffect(() => {
        if (isLoading) {
            setDelayLoading(true);
            return;
        } else {
            const handler = setTimeout(() => {
                setDelayLoading(false);
            }, 700);

            return () => {
                clearTimeout(handler);
            };
        }
    }, [isLoading]);

    return (
        <Paper sx={{ ...stylePaper, p: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography color="primary" fontWeight="500">
                    Top most recently Concepts
                </Typography>
                <FormControl>
                    <InputLabel id="limit-concept-label">Limit</InputLabel>
                    <Select
                        size="small"
                        labelId="limit-concept-label"
                        id="limit-concept-select"
                        value={limitConcept}
                        label="Limit"
                        onChange={(e) => setLimitConcept(e.target.value)}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading || delayLoading ? (
                <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </>
            ) : (
                <Box sx={{ mt: 1, maxHeight: 280, overflowY: 'auto' }}>
                    {listMostRecentConcept?.map((x, index) => (
                        <Typography key={index} sx={{ px: 1, py: 0.5 }}>
                            {index + 1} - {x.Title}
                        </Typography>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

export default memo(MostRecentConcept);
