import { ListItem, ListItemText, ListItemButton, Typography } from "@mui/material";


export function BarcodeListItem({ barcode, secondary, onSelect }) {
    return (
        <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton onClick={onSelect}>
                <ListItemText
                    primary={
                        <Typography fontFamily='monospace'>{barcode}</Typography>
                    }
                    secondary={secondary}
                />
            </ListItemButton>
        </ListItem>
    );
}
