import { Close, Refresh } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import { AppBar, IconButton, Paper, TextField, Toolbar, Typography } from "@mui/material";


export default function ControllerView({ children, title, onClose, onAdd, onRefresh, hasSearch, searchQuery, onSearchQueryChange }) {
    return (
        <>
            <ControllerAppBar
                title={title}
                onClose={onClose}
                onAdd={onAdd}
                onRefresh={onRefresh}
                hasSearch={hasSearch}
                searchQuery={searchQuery}
                onSearchQueryChange={onSearchQueryChange}
            />
            {children}
        </>
    );
}

function ControllerAppBar({ title, onClose, onAdd, onRefresh, hasSearch, searchQuery, onSearchQueryChange }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                {onClose &&
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                }
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {onRefresh &&
                    <IconButton onClick={onRefresh}>
                        <Refresh />
                    </IconButton>
                }
                {onAdd &&
                    <IconButton color="primary" onClick={onAdd}>
                        <AddIcon />
                    </IconButton>
                }
            </Toolbar>

            {hasSearch &&
                <Paper sx={{ m: 1, p: 1 }}>
                    <TextField
                        id="standard-search"
                        label="Zoek"
                        type="search"
                        variant="standard"
                        value={searchQuery}
                        onChange={onSearchQueryChange}
                        fullWidth
                        autoFocus
                    />
                </Paper>
            }
        </AppBar>
    );
}
