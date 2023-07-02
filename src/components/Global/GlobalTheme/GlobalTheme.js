import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTheme } from '~/utils/base/theme';
import { useDarkMode } from '~/stores';
import { Box } from '@mui/material';

function GlobalTheme({ children }) {
    const darkModeState = useDarkMode((state) => state.enabledState);

    // const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTheme(themeName))), [themeName]);
    const theme = useMemo(() => createTheme(getDesignTheme(darkModeState)), [darkModeState]);
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    bgcolor: 'background.default',
                    color: 'text.primary',
                }}
                className={darkModeState ? 'dark-mode' : ''}
            >
                {children}
            </Box>
        </ThemeProvider>
    );
}

export default GlobalTheme;
