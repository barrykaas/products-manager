import { ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

import ReceiptAvatar from "./ReceiptAvatar";
import { isoToRelativeDate } from "src/utils/dateTime";
import { formatEuro } from "src/utils/monetary";


export function ReceiptsListItem({ receipt, ...props }) {
    const secondaryData = [
        receipt.item_count + ' item' + (receipt.item_count === 1 ? '' : 's'),
        receipt.event_count + ' event' + (receipt.event_count === 1 ? '' : 's'),
    ];

    return (
        <ListItemButton
            key={receipt.id}
            divider
            sx={{ width: 1 }}
            {...props}
        >
            <ListItemAvatar>
                <ReceiptAvatar receipt={receipt} />
            </ListItemAvatar>
            <ListItemText
                secondary={secondaryData.map(String).join(' - ')}
            >
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            {isoToRelativeDate(receipt.date)}
                        </Typography>
                        <Typography>{receipt.name}</Typography>
                    </Stack>
                    <Typography align="right" sx={{ whiteSpace: "nowrap" }}><b>{formatEuro(receipt.total)}</b></Typography>
                </Stack>
            </ListItemText>
        </ListItemButton>
    );
}
