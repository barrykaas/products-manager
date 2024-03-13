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
import { Balance, Groups, QrCode, ReceiptLong, Sell, Settings, ShoppingCart } from '@mui/icons-material';
import { SwipeableDrawer } from '@mui/material';

import ReceiptsController from './Receipts/ReceiptsController/ReceiptsController';
import EventController from './Events/EventController';
import ProductController from './Products/ProductController';
import BrandController from './Brands/BrandController';
import BalanceInfo from './Balance/BalanceInfo';
import SettingsPage from './Settings/SettingsPage';
import ScannedItemsController from './ScannedItems/ScannedItemsController';


export const drawerWidth = 240;
const iOS =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);


const views = [
    {
        id: "receipts", title: "Bonnetjes", icon: <ReceiptLong />,
        search: true
    },
    {
        id: "events", title: "Events", icon: <Groups />,
        search: true
    },
    {
        id: "balances", title: "Balans", icon: <Balance />,
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
        id: "scanneditems", title: "Gescand", icon: <QrCode />,
        refresh: true, add: true
    },
    { id: "settings", title: "Instellingen", icon: <Settings /> },
];

export default function MainNav() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentView, setCurrentView] = useState(views[0])

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
        setCurrentView(view);
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
                    <ListItemButton key={view.title}
                        onClick={() => handleSelectView(view)}
                        selected={currentView.title === view.title}
                    >
                        <ListItemIcon>
                            {view.icon}
                        </ListItemIcon>
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
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)`, xs: 1 }}}
            >
                <ViewPanel id="receipts" currentView={currentView} search>
                    <ReceiptsController onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="events" currentView={currentView} search>
                    <EventController onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="products" currentView={currentView} search>
                    <ProductController onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="brands" currentView={currentView}>
                    <BrandController onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="scanneditems" currentView={currentView}>
                    <ScannedItemsController onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="balances" currentView={currentView}>
                    <BalanceInfo onMenu={handleDrawerToggle} />
                </ViewPanel>

                <ViewPanel id="settings" currentView={currentView}>
                    <SettingsPage onMenu={handleDrawerToggle} />
                </ViewPanel>

            </Box>
        </Box>
    );
}

function ViewPanel({ id, currentView, children }) {
    const hidden = id !== currentView?.id;
    return (
        <div hidden={hidden}>
            {hidden || children}
        </div>
    );
}
