import { Navigate, createBrowserRouter } from "react-router";

import Root from "src/pages/Root";
import ReceiptView, { receiptLoader } from "src/pages/ReceiptView";
import Dashboard from "src/pages/Dashboard";
import Receipts from "src/pages/Receipts";
import Balance from "src/pages/Balance";
import Settings from "src/pages/Settings";
import Products from "src/pages/Products";
import ScannedItems from "src/pages/ScannedItems";
import Brands from "src/pages/Brands";
import Transactions from "src/pages/Transactions";
import Events from "src/pages/Events";
import ReceiptItems from "src/pages/ReceiptItems";


export const router = createBrowserRouter([
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
                element: <Receipts />
            },
            {
                path: "receipts/:receiptId",
                element: <ReceiptView />,
                loader: receiptLoader
            },
            {
                path: "receipt-items",
                element: <ReceiptItems />
            },

            {
                path: "events",
                element: <Events />
            },
            {
                path: "balance",
                element: <Balance />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "brands",
                element: <Brands />
            },
            {
                path: "scanned",
                element: <ScannedItems />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "transactions",
                element: <Transactions />
            },
        ]
    },
]);
