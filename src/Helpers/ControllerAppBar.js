import { Close, Refresh } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";


export default function ControllerAppBar({ title, onClose, onAdd, onRefresh }) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                {onClose &&
                    <IconButton onClick={onRefresh}>
                        <Close />
                    </IconButton>
                }
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {onRefresh ?
                    <IconButton onClick={onRefresh}>
                        <Refresh />
                    </IconButton>
                    : null}
                {onAdd &&
                    <IconButton color="primary" onClick={onAdd}>
                        <AddIcon />
                    </IconButton>
                }
            </Toolbar>
        </AppBar>
    );
}
