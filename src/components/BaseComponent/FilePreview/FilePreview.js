import { alpha } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import { getFileData, formatData } from '~/utils/common/utils';
import FileThumbnail from '~/components/BaseComponent/FileThumbnail';
import { IconButton, ListItemText, Stack } from '@mui/material';

export default function FilePreview({ thumbnail, files, onRemove, sx }) {
    return (
        <div>
            {files?.map((file) => {
                const { key, name = '', size = 0 } = getFileData(file);

                const isNotFormatFile = typeof file === 'string';

                if (thumbnail) {
                    return (
                        <Stack
                            key={key}
                            component={'div'}
                            alignItems="center"
                            display="inline-flex"
                            justifyContent="center"
                            sx={{
                                m: 0.5,
                                width: 80,
                                height: 80,
                                borderRadius: 1.25,
                                overflow: 'hidden',
                                position: 'relative',
                                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                                ...sx,
                            }}
                        >
                            <FileThumbnail
                                tooltip
                                imageView
                                file={file}
                                sx={{ position: 'absolute' }}
                                imgSx={{ position: 'absolute' }}
                            />

                            {onRemove && (
                                <IconButton
                                    size="small"
                                    onClick={() => onRemove(file)}
                                    sx={{
                                        p: 0.5,
                                        top: 4,
                                        right: 4,
                                        position: 'absolute',
                                        color: 'common.white',
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                        },
                                    }}
                                >
                                    <CloseIcon width={14} />
                                </IconButton>
                            )}
                        </Stack>
                    );
                }

                return (
                    <Stack
                        key={key}
                        component={'div'}
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        sx={{
                            my: 1,
                            py: 1,
                            px: 1.5,
                            borderRadius: 1,
                            border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                            ...sx,
                        }}
                    >
                        <FileThumbnail file={file} />

                        <ListItemText
                            primary={isNotFormatFile ? file : name}
                            secondary={isNotFormatFile ? '' : formatData(size)}
                            secondaryTypographyProps={{
                                component: 'span',
                                typography: 'caption',
                            }}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        />

                        {onRemove && (
                            <IconButton size="small" onClick={() => onRemove(file)}>
                                <CloseIcon width={16} />
                            </IconButton>
                        )}
                    </Stack>
                );
            })}
        </div>
    );
}
