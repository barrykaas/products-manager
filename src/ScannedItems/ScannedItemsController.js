import { Typography, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import ScannedItemsList from "./ScannedItemsList";


export default function ScannedItemsController({ onClose, selectBarcode, disableKnownProducts = false }) {
    return (
        <Box sx={{ height: '100%' }}>
            <AppBar position="sticky">
                <Toolbar>
                    {onClose
                        ? (<IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>)
                        : null}
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Gescand
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '100%', overflow: "scroll" }}>
                <ScannedItemsList selectBarcode={selectBarcode} disableKnownProducts={disableKnownProducts} />
            </Box>
        </Box>
    );
}
