import { Container } from "@mui/material";
import { createBrowserRouter } from "react-router-dom";

import MainNav from "./MainNav";
import ReceiptsController from "./Receipts/ReceiptsController/ReceiptsController";
import EventController from "./Events/EventController";
import BalanceInfo from "./Balance/BalanceInfo";
import ProductController from "./Products/ProductController";
import BrandController from "./Brands/BrandController";
import ScannedItemsController from "./ScannedItems/ScannedItemsController";
import SettingsPage from "./Settings/SettingsPage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "receipts",
                element: <ReceiptsController />
            },
            {
                path: "events",
                element: <EventController />
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
        ]
    },
]);


function Root() {
    return (
        <Container
            maxWidth={false}
            disableGutters
        >
            <MainNav />
        </Container>
    );
}
