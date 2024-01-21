import { Typography, Grid, Stack, Chip, Button, List, Divider, ButtonGroup, Paper, Tooltip } from "@mui/material";
import { Fragment } from "react";

import ReceiptItem from "./ReceiptItem";
import { useEvent } from "../../Events/EventsApiQueries";
import { isoToLocalDate } from "../../Helpers/dateTime";
import { formatEuro } from "../../Helpers/monetary";


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

    const eventTotal = eventItems.reduce((s, i) => s + i.amount, 0);

    return (
        <Paper>
            <Stack>
                {/* Header */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item>
                        <Tooltip arrow title={
                            <Typography variant="caption" fontFamily="monospace">
                                ID: {eventId}
                            </Typography>
                        }>
                            <Typography variant="h6" component="div">
                                {eventName}
                            </Typography>
                        </Tooltip>
                    </Grid>

                    {formattedDate
                        ? (
                            <Grid item>
                                <Chip label={formattedDate} variant="outlined" />
                            </Grid>
                        ) : null
                    }

                    <Grid item>
                        <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                            <Button variant="outlined" size="small" onClick={onAddProduct}>
                                + Product
                            </Button>
                            <Button variant="outlined" size="small" onClick={onAddDiscount} color="warning">
                                + Korting
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Divider />

                {/* List items */}
                <List>
                    {eventItems.map((item) =>
                        <Fragment key={item.id}>
                            <ReceiptItem item={item} />
                            <Divider />
                        </Fragment>
                    )}
                </List>

                {/* Footer */}
                <Stack
                    sx={{ p: 1, pb: 2 }}
                    direction="row" alignItems="center" justifyContent="space-evenly"
                >
                    <Button variant="outlined" onClick={onAddProduct}>
                        + Product
                    </Button>
                    <Button variant="outlined" onClick={onAddDiscount} color="warning">
                        + Korting
                    </Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ px: 2, py: 1 }}>
                    <Typography component="div">
                        Totaal van <em>{eventName}</em>
                    </Typography>
                    <div style={{ flexGrow: 1 }}></div>
                    <Typography variant="h6" component="div" sx={{ "white-space": "nowrap" }}>
                        {formatEuro(eventTotal)}
                    </Typography>
                </Stack>

            </Stack>
        </Paper>
    );
}
