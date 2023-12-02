import { Typography, Stack, Chip, Button, List, Divider } from "@mui/material";
import { Fragment } from "react";

import ReceiptItem from "./ReceiptItem";


export default function ReceiptEventBlock({ eventId, eventItems, onAdd }) {
    const formattedDate = "DATUM";
    const eventName = "eventnaam";

    return (
        <>
            <Stack direction="row" spacing={1}>
                <Typography variant="h6" component="div">
                    {eventName}
                </Typography>
                <Chip label={formattedDate} variant="outlined" />
                <div style={{ flexGrow: 1 }}></div>
                <Button variant="outlined" size="small" onClick={onAdd}>
                    Voeg product toe
                </Button>
            </Stack>

            <List>
                {eventItems.map((item) => 
                    <Fragment id={item.id}>
                        <ReceiptItem item={item} />
                        <Divider />
                    </Fragment>
                )}
            </List>
        </>
    );
}
