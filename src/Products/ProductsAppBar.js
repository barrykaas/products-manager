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
import CloseIcon from '@mui/icons-material/Close';

export function ProductAppBar({ onAdd }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Products
                </Typography>
                <IconButton onClick={onAdd} color="primary" aria-label="add to shopping cart">
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export function ProductAppBarClosable({ onAdd, onClose }) {
    return (

        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Selecteer product
                </Typography>
                <IconButton onClick={onAdd} color="primary" aria-label="add to shopping cart">
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
