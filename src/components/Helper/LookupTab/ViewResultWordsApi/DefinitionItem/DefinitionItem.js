import { memo, useState } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import MySnackbar from '~/components/BaseComponent/MySnackbar';
import RelationBox from '~/components/Helper/LookupTab/ViewResultWordsApi/RelationBox';
import _ from 'lodash';
import { convertCamelCaseToTitleCase } from '~/utils/common/utils';

const styleBox = {
    backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
    py: 0.5,
    px: 1,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.2),
    },
};
function DefinitionItem({ data }) {
    const [openSnack, setOpenSnack] = useState(false);
    const { definition, examples, partOfSpeech, ...relationObj } = data;

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setOpenSnack(true);
    };

    if (!data || typeof data !== 'object' || !definition) {
        return <></>;
    }

    return (
        <Box
            sx={{
                p: 1,
                my: 2,
                mx: 0,
                border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.5)}`,
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.08),
                borderRadius: '4px',
            }}
        >
            <MySnackbar open={openSnack} setOpen={setOpenSnack} />
            <Box>
                <Typography color="info.main" component="span">
                    Part of Speech{': '}
                </Typography>
                <Typography component="span">{partOfSpeech}</Typography>
            </Box>
            <Box sx={{ mt: 0.5 }} onClick={() => handleCopyToClipboard(definition)}>
                <Typography color="info.main">Definition{': '}</Typography>
                <Typography sx={styleBox}>{definition}</Typography>
            </Box>

            {examples?.length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                    <Typography color="info.main">Example{': '}</Typography>
                    {examples?.map((item, index) => (
                        <Typography
                            key={index}
                            onClick={() => handleCopyToClipboard(item)}
                            sx={{ ...styleBox, mt: 0.5 }}
                        >
                            {index + 1} - {item}
                        </Typography>
                    ))}
                </Box>
            )}

            {!_.isEmpty(relationObj) && (
                <Box sx={{ mt: 1 }}>
                    {Object.keys(relationObj).map((key) => (
                        <RelationBox
                            key={key}
                            label={convertCamelCaseToTitleCase(key)}
                            listData={relationObj[key]}
                            sx={{
                                mt: 1,
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default memo(DefinitionItem);
