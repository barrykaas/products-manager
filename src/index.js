import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from "react-cookie";
import { CssBaseline, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@emotion/react';
import { ConfirmProvider } from 'material-ui-confirm';
import { RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navigate, createBrowserRouter } from "react-router-dom";

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { apiLocations, defaultQueryFn, genericItemLoader } from './Api/Common';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './ErrorBoundary/Fallback';
import Root from './Root';
import ReceiptsController from "./Receipts/ReceiptsController/ReceiptsController";
import EventController from "./Events/EventController";
import BalanceInfo from "./Balance/BalanceInfo";
import ProductController from "./Products/ProductController";
import BrandController from "./Brands/BrandController";
import ScannedItemsController from "./ScannedItems/ScannedItemsController";
import SettingsPage from "./Settings/SettingsPage";
import ReceiptView from './Receipts/ReceiptView';
import EventFormView from './Events/EventFormView';
import Dashboard from './Dashboard';
import ReceiptItemsView from './Receipts/ReceiptItemsView';


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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "products-manager",
        element: <Navigate to="/" replace />
      },

      {
        path: "dashboard",
        element: <Dashboard />
      },

      {
        path: "receipts",
        element: <ReceiptsController />
      },
      {
        path: "receipts/:itemId",
        element: <ReceiptView />,
        loader: genericItemLoader(queryClient, apiLocations.receipts)
      },
      {
        path: "receipts/new",
        element: <ReceiptView />
      },

      {
        path: "events",
        element: <EventController />
      },
      {
        path: "events/:itemId",
        element: <EventFormView />,
        loader: genericItemLoader(queryClient, apiLocations.events)
      },
      {
        path: "events/new",
        element: <EventFormView />
      },

      {
        path: "balance",
        element: <BalanceInfo />
      },
      {
        path: "products",
        element: <ProductController />
      },
      {
        path: "brands",
        element: <BrandController />
      },
      {
        path: "scanned",
        element: <ScannedItemsController />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "receipt-items",
        element: <ReceiptItemsView />
      },
    ]
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <ErrorBoundary FallbackComponent={Fallback}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <ConfirmProvider>
              <RouterProvider router={router} />
            </ConfirmProvider>
          </ThemeProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </CookiesProvider>
  </React.StrictMode>
);
