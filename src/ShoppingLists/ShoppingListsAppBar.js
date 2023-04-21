import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';

export default function ShoppingListsAppBar({handleAddButton}) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Shopping lists
                    </Typography>
                    <IconButton color="primary" aria-label="add to shopping cart" onClick={handleAddButton}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}