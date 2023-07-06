import { memo, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Typography } from '@mui/material';
import { stylePaper } from '~/utils/style/muiCustomStyle';
import { getListMostRecentExample } from '~/services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { getDisplayExample, stripHtmlExceptHighlight } from '~/utils/common/utils';
import Markdown from '~/components/BaseComponent/Markdown';

function MostRecentExample() {
    const [limitExample, setLimitExample] = useState(5);

    const { data: listMostRecentExample, isLoading } = useQuery({
        queryKey: ['getListMostRecentExample', limitExample],
        queryFn: async () => {
            const res = await getListMostRecentExample(limitExample);
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
                    Top most recently Examples
                </Typography>
                <FormControl>
                    <InputLabel id="limit-example-label">Limit</InputLabel>
                    <Select
                        size="small"
                        labelId="limit-example-label"
                        id="limit-example-select"
                        value={limitExample}
                        label="Limit"
                        onChange={(e) => setLimitExample(e.target.value)}
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
                    {listMostRecentExample?.map((x, index) => (
                        <Typography component="div" key={index} sx={{ px: 1, py: 0.5 }}>
                            <Markdown
                                children={`${index + 1} - ${getDisplayExample(stripHtmlExceptHighlight(x.DetailHtml))}`}
                            />
                        </Typography>
                    ))}
                </Box>
            )}
        </Paper>
    );
}

export default memo(MostRecentExample);
