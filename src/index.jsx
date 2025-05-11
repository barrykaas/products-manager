import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@emotion/react';
import { ConfirmProvider } from 'material-ui-confirm';
import { RouterProvider } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Fallback } from 'src/components/errorBoundary';
import { router } from 'src/router';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 1000,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary FallbackComponent={Fallback}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <ConfirmProvider>
                        <RouterProvider router={router} />
                    </ConfirmProvider>
                </ThemeProvider>
                <ReactQueryDevtools buttonPosition="bottom-left" />
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
