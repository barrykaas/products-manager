import { Typography, Stack, Chip, Button, List, Divider, Box, ButtonGroup } from "@mui/material";
import { Fragment } from "react";

import ReceiptItem from "./ReceiptItem";
import { useEvent } from "../../Events/EventsApiQueries";
import { isoToLocalDate } from "../../Helpers/dateTime";


export default function ReceiptEventBlock({ eventId, eventItems, onAddProduct, onAddDiscount }) {
    const eventQuery = useEvent(eventId);

    let formattedDate, eventName;
    if (eventQuery.isLoading) {
        eventName = "Event laden...";
    } else if (eventQuery.isError) {
        eventName = `ERROR event ${eventId}`;
    } else {
        const event = eventQuery.data;
        eventName = event.name;
        formattedDate = isoToLocalDate(event.event_date);
    }


    return (
        <>
            <Box sx={{ my: 1, mx: 2 }}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h6" component="div">
                        {eventName}
                    </Typography>

                    {formattedDate
                        ? <Chip label={formattedDate} variant="outlined" />
                        : null
                    }

                    <div style={{ flexGrow: 1 }}></div>

                    {/* <Button variant="outlined" size="small" onClick={onAddProduct}>
                        + Product
                    </Button> */}
                    <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                        <Button variant="outlined" size="small" onClick={onAddProduct}>
                            + Product
                        </Button>
                        <Button variant="outlined" size="small" onClick={onAddDiscount}>
                            + Korting
                        </Button>
                    </ButtonGroup>
                </Stack>
            </Box>

            <Divider />

            <List>
                {eventItems.map((item) =>
                    <Fragment key={item.id}>
                        <ReceiptItem item={item} />
                        <Divider />
                    </Fragment>
                )}
            </List>
        </>
    );
}
