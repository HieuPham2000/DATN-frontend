import { alpha } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import { formatData, getFileData } from '~/utils/common/utils';

export default function RejectionFiles({ fileRejections }) {
    if (!fileRejections.length) {
        return null;
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                py: 1,
                px: 2,
                mt: 3,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
            }}
        >
            {fileRejections.map(({ file, errors }) => {
                const { path, size } = getFileData(file);

                return (
                    <Box key={path} sx={{ my: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                            {path} - {size ? formatData(size) : ''}
                        </Typography>

                        {errors.map((error) => (
                            <Box key={error.code} component="p" sx={{ typography: 'caption' }}>
                                - {error.message}
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Paper>
    );
}
