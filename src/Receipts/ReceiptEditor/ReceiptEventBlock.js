import { Typography, Grid, Stack, Chip, Button, List, Divider, ButtonGroup, Paper, Tooltip, IconButton, Box } from "@mui/material";
import { Fragment, useState } from "react";
import { Edit } from "@mui/icons-material";

import ReceiptItem from "./ReceiptItem";
import { isoToRelativeDate } from "../../Helpers/dateTime";
import { formatEuro } from "../../Helpers/monetary";
import { PersonAvatarGroup } from "../../Persons/Avatars/Avatars";
import { EventFormDialog } from "../../Events/EventForm";
import { useQuery } from "@tanstack/react-query";


function AddProductButton({ variant = "outlined", ...args }) {
    return (
        <Button variant="outlined" {...args}>
            + Product
        </Button>
    );
}

function AddAmountButton({ variant = "outlined", ...args }) {
    return (
        <Button variant="outlined" color="warning" {...args}>
            + Los bedrag
        </Button>
    );
}


function Header({ itemId, title, date, personIds, onAddProduct, onAddAmount, onEdit }) {
    const formattedDate = isoToRelativeDate(date);

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
                <PersonAvatarGroup personIds={personIds} />
            </Grid>

            <Grid item>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <AddProductButton onClick={onAddProduct} />
                    <AddAmountButton onClick={onAddAmount} />
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}


export default function ReceiptEventBlock({ eventId, eventItems, onAddProduct, onAddDiscount }) {
    const eventQuery = useQuery({ queryKey: ['events', eventId] });
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
                    <AddProductButton onClick={onAddProduct} />
                    <AddAmountButton onClick={onAddDiscount} />
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

export function QuickAddBlock({ onAddAmount, onAddProduct }) {
    return (
        <Paper sx={{ borderWidth: 2, borderStyle: "dashed", borderColor: "#888888", mx: 2, p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="subtitle" sx={{ fontStyle: "italic" }}>
                    Kies een bestaand event rechtsboven of quick add een nieuw event:
                </Typography>
                <Stack
                    direction="row" alignItems="center" justifyContent="space-evenly"
                >
                    <AddProductButton onClick={onAddProduct} />
                    <AddAmountButton onClick={onAddAmount} />
                </Stack>
            </Stack>
        </Paper>
    );
}
