import { Add, Close, Refresh } from "@mui/icons-material";
import { AppBar, Box, Fab, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import ToolbarSearch from "./ToolbarSearch";


export default function ControllerView({ children, title, onClose, onAdd, onRefresh, initialSearch, handleNewSearch, onMenu }) {
    return (
        <Box sx={{ height: 1, width: 1 }}>
            <ControllerAppBar
                title={title}
                onClose={onClose}
                onAdd={onAdd}
                onRefresh={onRefresh}
                onMenu={onMenu}
                initialSearch={initialSearch}
                handleNewSearch={handleNewSearch}
            />

            {children}

            <Stack spacing={1} alignItems="center" sx={{ position: "fixed", bottom: "20px", right: "20px" }}>
                {onRefresh &&
                    <Fab size="small" onClick={onRefresh}>
                        <Refresh />
                    </Fab>
                }
                {onAdd &&
                    <Fab color="primary" onClick={onAdd}>
                        <Add />
                    </Fab>
                }
            </Stack>

        </Box>
    );
}

function ControllerAppBar({ title, onClose, initialSearch, handleNewSearch, onMenu }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                {onClose ||
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenu}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                }
                {onClose &&
                    <IconButton
                        edge="start"
                        onClick={onClose}
                    >
                        <Close />
                    </IconButton>
                }
                <Typography variant="h6" noWrap component="div">
                    {title}
                </Typography>
                <Box flexGrow={1} />
                {handleNewSearch &&
                    <ToolbarSearch
                        initialValue={initialSearch}
                        handleNewValue={handleNewSearch}
                    />
                }
            </Toolbar>
        </AppBar>
    );
}
