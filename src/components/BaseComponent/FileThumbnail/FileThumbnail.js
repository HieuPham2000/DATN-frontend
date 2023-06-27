import { Box, Stack, Tooltip } from '@mui/material';
import { getFileFormat, getFileThumb } from '~/components/BaseComponent/FileThumbnail/utils';
import { getFileData } from '~/utils/common/utils';

export default function FileThumbnail({ file, tooltip, imageView, sx, imgSx }) {
    const { name = '', path = '', preview = '' } = getFileData(file);

    const format = getFileFormat(path || preview);

    const renderContent =
        format === 'image' && imageView ? (
            <Box
                component="img"
                src={preview}
                sx={{
                    width: 1,
                    height: 1,
                    flexShrink: 0,
                    objectFit: 'cover',
                    ...imgSx,
                }}
            />
        ) : (
            <Box
                component="img"
                src={getFileThumb(format)}
                sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    ...sx,
                }}
            />
        );

    if (tooltip) {
        return (
            <Tooltip title={name}>
                <Stack
                    flexShrink={0}
                    component="span"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: 'fit-content',
                        height: 'inherit',
                    }}
                >
                    {renderContent}
                </Stack>
            </Tooltip>
        );
    }

    return <>{renderContent}</>;
}
