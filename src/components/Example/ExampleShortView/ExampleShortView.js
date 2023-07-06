import { Box, Chip, Skeleton, Tooltip, Typography, alpha } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import Markdown from '~/components/BaseComponent/Markdown/Markdown';
import { getExample } from '~/services/exampleService';
import { getDisplayExampleAttribute, stripHtmlExceptHighlight } from '~/utils/common/utils';

function ExampleShortView({ exampleId }) {
    const { data: currentExample, isLoading } = useQuery({
        queryKey: ['example', exampleId],
        queryFn: async () => {
            const res = await getExample(exampleId);
            return res.data.Data;
        },
        enabled: !!exampleId,
    });

    const [delayLoading, setDelayLoading] = useState(isLoading);

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

    if (!exampleId || !currentExample) {
        return <></>;
    }

    if (isLoading || delayLoading) {
        return (
            <>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
            </>
        );
    }

    return (
        <>
            <Box sx={{ mt: 1 }}>
                {getDisplayExampleAttribute(currentExample).map((displayAttribute) => (
                    <Chip
                        key={displayAttribute}
                        label={displayAttribute}
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1, my: 0.5 }}
                    />
                ))}
            </Box>
            <Box
                sx={{
                    mt: 1,
                    p: 2,
                    // backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.078),
                    border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
                }}
            >
                <Typography component="div">
                    <Markdown children={stripHtmlExceptHighlight(currentExample.DetailHtml)} />
                </Typography>
                {!!currentExample.Note && (
                    <Box
                        sx={{
                            mt: 2,
                        }}
                    >
                        <Typography>
                            Notes:{' '}
                            <Typography component="span" fontStyle="italic">
                                {currentExample.Note}
                            </Typography>
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography component="span" sx={{ fontWeight: '500' }}>
                    {`Linked Concepts: `}
                </Typography>
                {currentExample.ListExampleRelationship && currentExample.ListExampleRelationship.length > 0 ? (
                    <Box>
                        {currentExample.ListExampleRelationship.map((x) => (
                            <Tooltip title={x.ExampleLinkName} key={x.ConceptId}>
                                <Chip label={x.Concept} sx={{ mr: 1, my: 0.5 }} />
                            </Tooltip>
                        ))}
                    </Box>
                ) : (
                    <Typography component="span" color="text.secondary">
                        No linked concepts
                    </Typography>
                )}
            </Box>
        </>
    );
}

export default memo(ExampleShortView);
