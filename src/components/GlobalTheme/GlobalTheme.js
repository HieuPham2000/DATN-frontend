import { useState, createContext, useMemo } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { getDesignTheme } from '~/scripts/base/theme';
import { ThemeName } from '~/scripts/common/constant';

export const GlobalThemeContext = createContext();

function GlobalTheme({ children }) {
    // const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTheme(mode))), [mode]);
    // return <ThemeProvider theme={theme}>{children}</ThemeProvider>;

    const [themeName, setThemeName] = useState(() => {
        let currentThemeName = localStorage.getItem("themeName") || ThemeName.Light;
        return currentThemeName;
    });

    const toggleTheme = () => {
        let newThemeName = themeName === ThemeName.Light ? ThemeName.Dark : ThemeName.Light;
        localStorage.setItem("themeName", newThemeName);
        setThemeName(newThemeName);
    };
    // const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTheme(themeName))), [themeName]);
    const theme = useMemo(() => createTheme(getDesignTheme(themeName)), [themeName]);
    return (
        <GlobalThemeContext.Provider value={[themeName, toggleTheme]}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </GlobalThemeContext.Provider>
    );
}

export default GlobalTheme;
