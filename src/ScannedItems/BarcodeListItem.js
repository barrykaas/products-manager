import { Box, ListItem, ListItemText, ListItemButton } from "@mui/material";


export function BarcodeListItem({ barcode, secondary, onSelect }) {
    return (
        <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton onClick={onSelect}>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'inline', fontFamily: 'Monospace' }}>{barcode}</Box>
                    }
                    secondary={secondary}
                />
            </ListItemButton>
        </ListItem>
    );
}
