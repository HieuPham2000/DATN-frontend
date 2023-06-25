import { ThemeName } from '~/utils/common/constant';

const getDesignTheme = (darkModeEnabled) => ({
    palette: {
        mode: darkModeEnabled ? ThemeName.Dark : ThemeName.Light,
        ...(darkModeEnabled
            ? {
                  background: {
                      default: '#161C24',
                      paper: '#161C24',
                  },
              }
            : {}),
        primary: {
            light: '#5BE584',
            main: '#00AB55',
            dark: '#007B55',
            contrastText: '#fff',
        },
        secondary: {
            light: '#84A9FF',
            main: '#3366FF',
            dark: '#1939B7',
            contrastText: '#fff',
        },
        info: {
            light: '#61F3F3',
            main: '#00B8D9',
            dark: '#006C9C',
            contrastText: '#fff',
        },
        success: {
            light: '#86E8AB',
            main: '#36B37E',
            dark: '#1B806A',
            contrastText: '#fff',
        },
        warning: {
            light: '#86E8AB',
            main: '#36B37E',
            dark: '#1B806A',
            contrastText: '#fff',
        },
        error: {
            light: '#FFAC82',
            main: '#FF5630',
            dark: '#B71D18',
            contrastText: '#fff',
        },
        minor: {
            main: '#637381',
        },
    },
    typography: {
        htmlFontSize: 10,
        h1: {
            fontWeight: 700,
            fontSize: '6.4rem',
            lineHeight: 1.25,
            letterSpacing: '0em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '4.8rem',
            lineHeight: 1.334,
            letterSpacing: '0em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '3.2rem',
            lineHeight: 1.5,
            letterSpacing: '0em',
        },
        h4: {
            fontWeight: 700,
            fontSize: '2.4rem',
            lineHeight: 1.5,
            letterSpacing: '0em',
        },
        h5: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.5,
            letterSpacing: '0em',
        },
        h6: {
            fontWeight: 700,
            fontSize: '1.8rem',
            lineHeight: 1.556,
            letterSpacing: '0em',
        },
        body1: {
            fontSize: '1.4rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '1.4rem',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: '1.4rem',
                },
            },
        },
        MuiLoadingButton: {
            styleOverrides: {
                root: {
                    fontSize: '1.4rem',
                },
            },
        },
    },
});

export { getDesignTheme };
