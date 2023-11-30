import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';


export default function ReceiptsAppBar({ handleAddButton }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Bonnetjes
                    </Typography>
                    <IconButton color="primary" aria-label="voeg bonnetje toe" onClick={handleAddButton}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}