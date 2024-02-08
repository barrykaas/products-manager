import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Refresh } from '@mui/icons-material';


export default function EventAppBar({ onAdd, onClose, onRefresh, title }) {
    return (

        <AppBar position="static">
            <Toolbar>
                {onClose ?
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    : null}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {onRefresh ?
                    <IconButton onClick={onRefresh}>
                        <Refresh />
                    </IconButton>
                    : null}
                <IconButton onClick={onAdd} color="primary" aria-label="add to shopping cart">
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
