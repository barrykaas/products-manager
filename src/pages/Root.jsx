import { Balance, Dashboard, Groups, ListAlt, Payment, QrCode, ReceiptLong, Sell, Settings, ShoppingCart } from "src/components/icons";
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Icon, SwipeableDrawer } from '@mui/material';
import { Link, Navigate, Outlet, useLocation, useSearchParams } from "react-router";

import { PageTitleContext } from 'src/context/PageTitle';
import { SearchParamsContext } from 'src/context/searchParams';


export const drawerWidth = 240;
const iOS =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);


const views = [
    {
        id: "dashboard", title: "Dashboard", icon: "dashboard",
        search: true
    },
    {
        id: "receipts", title: "Bonnetjes", icon: "receipt_long",
        search: true
    },
    {
        id: "receipt-items", title: "Bonnetjesitems", icon: "list_alt",
        search: true
    },
    {
        id: "events", title: "Events", icon: "groups",
        search: true
    },
    {
        id: "balance", title: "Balans", icon: "balance",
        refresh: true
    },
    {
        id: "products", title: "Producten", icon: "shopping_cart",
        search: true
    },
    {
        id: "brands", title: "Merken", icon: "sell",
        refresh: true, add: true
    },
    {
        id: "scanned", title: "Gescand", icon: "qr_code",
        refresh: true, add: true
    },
    {
        id: "transactions", title: "Transacties", icon: "payment"
    },
    {
        id: "settings", title: "Instellingen", icon: "settings"
    },
];

export default function Root() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { pathname } = useLocation();
    const [_appBarTitle, setAppBarTitle] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const setPageTitle = (title) => {
        setAppBarTitle(title);
        if (title) {
            document.title = title + ' - KaasBalans';
        } else {
            document.title = 'KaasBalans';
        }
    };

    // Open first view by default
    if (pathname === "/") {
        return <Navigate to={"/" + views[0].id} replace />
    }

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleSelectView = () => {
        handleDrawerClose();
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h5">KaasBalans</Typography>
            </Toolbar>
            <Divider />
            <List>
                {views.map(view => (
                    <ListItemButton component={Link} to={view.id} key={view.id}
                        onClick={() => handleSelectView(view)}
                        selected={pathname.startsWith('/' + view.id)}
                    >
                        <ListItemIcon><Icon>{view.icon}</Icon></ListItemIcon>
                        <ListItemText primary={view.title} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <CssBaseline />
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="views"
            >
                <SwipeableDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    onOpen={() => setMobileOpen(true)}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                    disableSwipeToOpen={false}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </SwipeableDrawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)`, xs: 1 },
                }}
            >
                <PageTitleContext.Provider value={setPageTitle}>
                    <SearchParamsContext.Provider value={{ searchParams, setSearchParams }}>
                        <Outlet context={{ onMenu: handleDrawerToggle }} />
                    </SearchParamsContext.Provider>
                </PageTitleContext.Provider>
            </Box>
        </Box>
    );
}
