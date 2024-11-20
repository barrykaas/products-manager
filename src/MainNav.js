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
import { Balance, Dashboard, Groups, Payment, QrCode, ReceiptLong, Sell, Settings, ShoppingCart } from '@mui/icons-material';
import { SwipeableDrawer } from '@mui/material';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';


export const drawerWidth = 240;
const iOS =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);


const views = [
    {
        id: "dashboard", title: "Dashboard", icon: <Dashboard />,
        search: true
    },
    {
        id: "receipts", title: "Bonnetjes", icon: <ReceiptLong />,
        search: true
    },
    {
        id: "events", title: "Events", icon: <Groups />,
        search: true
    },
    {
        id: "balance", title: "Balans", icon: <Balance />,
        refresh: true
    },
    {
        id: "products", title: "Producten", icon: <ShoppingCart />,
        search: true
    },
    {
        id: "brands", title: "Merken", icon: <Sell />,
        refresh: true, add: true
    },
    {
        id: "scanned", title: "Gescand", icon: <QrCode />,
        refresh: true, add: true
    },
    {
        id: "transactions", title: "Transacties", icon: <Payment />
    },
    { id: "settings", title: "Instellingen", icon: <Settings /> },
];

export default function MainNav() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { pathname } = useLocation();

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

    const handleSelectView = (view) => {
        handleDrawerClose();
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h5">KaasProducten</Typography>
            </Toolbar>
            <Divider />
            <List>
                {views.map(view => (
                    <ListItemButton component={Link} to={view.id} key={view.id}
                        onClick={() => handleSelectView(view)}
                        selected={pathname.startsWith('/' + view.id)}
                    >
                        <ListItemIcon>{view.icon}</ListItemIcon>
                        <ListItemText primary={view.title} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)`, xs: 1 } }}
            >
                <Outlet context={{ onMenu: handleDrawerToggle }} />
            </Box>
        </Box>
    );
}
