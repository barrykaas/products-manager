import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Toolbar, Typography, IconButton, Paper, TextField } from '@mui/material';


export function ProductAppBar({ title = "Producten", onAdd, onClose, searchQuery, onSearchQueryChange }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                {onClose ? (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton onClick={onAdd} color="primary" aria-label="add to shopping cart">
                    <AddIcon />
                </IconButton>
            </Toolbar>

            <Paper sx={{ m: 1, p: 1 }}>
                <TextField
                    id="standard-search"
                    label="Zoek"
                    type="search"
                    variant="standard"
                    value={searchQuery}
                    onChange={onSearchQueryChange}
                    fullWidth
                />
            </Paper>
        </AppBar>
    );
}
