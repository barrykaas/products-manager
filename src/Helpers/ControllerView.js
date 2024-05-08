import { Add, ArrowBack, Close, FilterAlt, Refresh } from "@mui/icons-material";
import { AppBar, Box, Container, Fab, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useOutletContext } from "react-router-dom";

import ToolbarSearch from "./ToolbarSearch";


export default function ControllerView({ children, title, onClose, onBack, onAdd, onRefresh, onFilter, initialSearch, handleNewSearch, maxWidth = "md" }) {
    const { onMenu } = useOutletContext();

    return (
        <Box>
            <ControllerAppBar
                title={title}
                onClose={onClose}
                onBack={onBack}
                onMenu={onMenu}
                initialSearch={initialSearch}
                handleNewSearch={handleNewSearch}
            />

            <Container disableGutters maxWidth={maxWidth}>
                {children}
            </Container>

            <Stack spacing={1} alignItems="center" sx={{ position: "fixed", bottom: "20px", right: "20px" }}>
                {onFilter &&
                    <Fab size="small" color="secondary" onClick={onFilter}>
                        <FilterAlt />
                    </Fab>
                }
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

function ControllerAppBar({ title, onClose, onBack, onMenu, initialSearch, handleNewSearch }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                {onClose || onBack ||
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
                        sx={{ mr: 2 }}
                    >
                        <Close />
                    </IconButton>
                }
                {onBack &&
                    <IconButton
                        edge="start"
                        onClick={onBack}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
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
