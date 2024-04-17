import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfirmProvider } from "material-ui-confirm";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary';

import './App.css';
import { defaultQueryFn } from './Api/Common';
import Fallback from './ErrorBoundary/Fallback';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'


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
            queryFn: defaultQueryFn,
        },
    },
});


export default function App() {
    return (
        <ErrorBoundary FallbackComponent={Fallback}>
            <QueryClientProvider client={queryClient}>
                <div className="App">
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline />
                        <ConfirmProvider>

                            <RouterProvider router={router} />

                        </ConfirmProvider>
                    </ThemeProvider>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
