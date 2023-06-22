import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import * as serviceWorkerRegistration from '~/serviceWorkerRegistration';
import reportWebVitals from '~/reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import GlobalTheme from '~/components/GlobalTheme';
import GlobalToast from '~/components/GlobalToast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <GlobalTheme>
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <App />
                        </LocalizationProvider>
                    </QueryClientProvider>
                </HelmetProvider>
                <GlobalToast />
            </GlobalTheme>
        </GlobalStyles>
    </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
