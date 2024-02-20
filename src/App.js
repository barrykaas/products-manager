import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfirmProvider } from "material-ui-confirm";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './App.css';
import MainTabBar from './MainTabBar';
import { defaultQueryFn } from './Api/Common';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';


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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <ConfirmProvider>

              <MainTabBar />

            </ConfirmProvider>
          </ThemeProvider>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
