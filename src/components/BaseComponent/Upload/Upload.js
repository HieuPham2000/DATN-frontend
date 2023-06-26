import { useDropzone } from 'react-dropzone';
import { alpha } from '@mui/material/styles';
import uploadImg from '~/assets/images/upload.svg';
import RejectionFiles from '../RejectionFiles';
import PreviewFile from '~/components/BaseComponent/FilePreview';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

export default function Upload({
    disabled,
    multiple = false,
    accept,
    //
    error,
    helperText,
    //
    file,
    onDelete,
    //
    files,
    thumbnail,
    onUpload,
    onRemove,
    onRemoveAll,
    sx,
    ...other
}) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple,
        disabled,
        accept,
        ...other,
    });

    const hasFile = !multiple && !!file;

    const hasFiles = multiple && !!files && !!files.length;

    const hasError = isDragReject || !!error;

    const renderPlaceholder = (
        <Stack spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
            <img src={uploadImg} alt="Upload" style={{ maxWidth: '150px' }} />
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
                <Typography variant="body" sx={{ fontSize: '1.6rem', fontWeight: '500' }}>
                    Drop or Select file
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Drop files here or click
                    <Box
                        component="span"
                        sx={{
                            mx: 0.5,
                            color: 'primary.main',
                            textDecoration: 'underline',
                        }}
                    >
                        browse
                    </Box>
                    thorough your machine
                </Typography>
            </Stack>
        </Stack>
    );

    const renderMultiPreview = hasFiles && (
        <>
            <Box sx={{ my: 3 }}>
                <PreviewFile files={files} thumbnail={thumbnail} onRemove={onRemove} />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                {onRemoveAll && (
                    <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                        Remove All
                    </Button>
                )}

                {onUpload && (
                    <Button size="small" variant="contained" onClick={onUpload} startIcon={<CloudUpload />}>
                        Upload
                    </Button>
                )}
            </Stack>
        </>
    );

    const renderSinglePreview = hasFile && (
        <>
            <Box sx={{ mt: 3 }}>
                <PreviewFile files={[file]} thumbnail={thumbnail} onRemove={onRemove} />
            </Box>
        </>
    );

    return (
        <Box sx={{ width: 1, position: 'relative', ...sx }}>
            <Box
                {...getRootProps()}
                sx={{
                    px: 3,
                    pt: 2,
                    pb: 3,
                    outline: 'none',
                    borderRadius: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
                    transition: (theme) => theme.transitions.create(['opacity', 'padding']),
                    '&:hover': {
                        opacity: 0.72,
                    },
                    ...(isDragActive && {
                        opacity: 0.72,
                    }),
                    ...(disabled && {
                        opacity: 0.48,
                        pointerEvents: 'none',
                    }),
                    ...(hasError && {
                        color: 'error.main',
                        bgcolor: 'error.lighter',
                        borderColor: 'error.light',
                    }),
                }}
            >
                <input {...getInputProps()} />

                {renderPlaceholder}
            </Box>

            {helperText && helperText}

            <RejectionFiles fileRejections={fileRejections} />

            {hasFile && renderSinglePreview}

            {renderMultiPreview}
        </Box>
    );
}
