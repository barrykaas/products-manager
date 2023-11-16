import { Box, ListItem, ListItemText, ListItemButton } from "@mui/material";


export function BarcodeListItem({ barcode, secondary, handleSelection }) {
    return (
        <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton onClick={handleSelection}>
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
