import { Delete } from "@mui/icons-material";
import { Icon, IconButton } from "@mui/material";


export default function DeleteButton({ onClick, visible = true, ...props }) {
    return (
        <IconButton onClick={onClick} color="error" {...props}>
            {visible ? <Delete /> : <Icon />}
        </IconButton>
    );
}
