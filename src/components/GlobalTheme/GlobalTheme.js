import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTheme } from '~/utils/base/theme';
import { useDarkMode } from '~/stores';

function GlobalTheme({ children }) {
    const darkModeState = useDarkMode((state) => state.enabledState);

    // const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTheme(themeName))), [themeName]);
    const theme = useMemo(() => createTheme(getDesignTheme(darkModeState)), [darkModeState]);
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default GlobalTheme;
