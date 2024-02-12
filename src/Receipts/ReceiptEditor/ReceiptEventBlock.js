import { Typography, Grid, Stack, Chip, Button, List, Divider, ButtonGroup, Paper, Tooltip, IconButton } from "@mui/material";
import { Fragment, useState } from "react";
import { Edit } from "@mui/icons-material";

import ReceiptItem from "./ReceiptItem";
import { useEvent } from "../../Events/EventsApiQueries";
import { isoToLocalDate } from "../../Helpers/dateTime";
import { formatEuro } from "../../Helpers/monetary";
import PersonAvatar from "../../Persons/Avatars";
import { EventFormDialog } from "../../Events/EventForm";


function Header({ itemId, title, date, personIds, onAddProduct, onAddAmount, onEdit }) {
    const formattedDate = isoToLocalDate(date);

    return (
        <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
            <Grid item>
                <Tooltip arrow title={
                    <Typography variant="caption" fontFamily="monospace">
                        ID: {itemId}
                    </Typography>
                }>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Tooltip>
            </Grid>

            {onEdit ?
                <Grid item>
                    <IconButton size="small" onClick={onEdit}>
                        <Edit />
                    </IconButton>
                </Grid>
                : null}

            {date
                ? (
                    <Grid item>
                        <Chip label={formattedDate} variant="outlined" />
                    </Grid>
                ) : null
            }

            <Grid item>
                <Stack direction="row" spacing={0.5}>
                    {personIds.map(parId =>
                        <Fragment key={parId}>
                            <PersonAvatar personId={parId} size={30} />
                        </Fragment>
                    )}
                </Stack>
            </Grid>

            <Grid item>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <Button variant="outlined" size="small" onClick={onAddProduct}>
                        + Product
                    </Button>
                    <Button variant="outlined" size="small" onClick={onAddAmount} color="warning">
                        + Los bedrag
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}


export default function ReceiptEventBlock({ eventId, eventItems, onAddProduct, onAddDiscount }) {
    const eventQuery = useEvent(eventId);
    const [editingEvent, setEditingEvent] = useState(false);

    const event = eventQuery.data;
    let eventName = event?.name ?? `Event ${eventId}`;
    if (eventQuery.isLoading) {
        eventName = "Event laden...";
    }

    const eventTotal = eventItems.reduce((s, i) => s + i.amount, 0);
    const participantIds = event?.event_participants ?? [];

    return (
        <Paper>
            <Stack>
                <Header
                    itemId={eventId}
                    title={eventName}
                    date={event?.event_date}
                    personIds={participantIds}
                    onAddProduct={onAddProduct}
                    onAddAmount={onAddDiscount}
                    onEdit={() => setEditingEvent(true)}
                />
                <EventFormDialog
                    open={editingEvent}
                    onClose={() => setEditingEvent(false)}
                    initialValues={event}
                    onSuccessfulCreateEdit={() => setEditingEvent(false)}
                />

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
                        + Los bedrag
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
