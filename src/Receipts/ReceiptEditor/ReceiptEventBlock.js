import { Typography, Grid, Stack, Chip, Button, List, Divider, ButtonGroup, Paper, Tooltip, IconButton, Box } from "@mui/material";
import { Fragment, useState } from "react";
import { Edit } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import ReceiptItem from "./ReceiptItem";
import { isoToRelativeDate } from "../../Helpers/dateTime";
import { formatEuro } from "../../Helpers/monetary";
import { PersonAvatarGroup } from "../../Persons/Avatars/Avatars";
import { EventFormDialog } from "../../Events/EventForm";
import QuickAddBox from "./QuickAddBox";
import { useListItemMutator } from "../../Lists/ListsApiQueries";


export default function ReceiptEventBlock({ eventId, listId, listItems, onAddProduct, onAddDiscount }) {
    const eventQuery = useQuery({ queryKey: ['events', eventId], enabled: !!eventId });
    const [editingEvent, setEditingEvent] = useState(false);
    const createListItem = useListItemMutator();

    const event = eventQuery.data;

    let eventName
    if (eventId) {
        eventName = event?.name ?? `Event ${eventId}`;
        if (eventQuery.isLoading) {
            eventName = "Event laden...";
        }
    }

    const eventTotal = listItems.reduce((s, i) => s + i.amount, 0);

    const handleAddedItem = (listItem) => {
        listItem.event = eventId;
        listItem.list = listId;
        createListItem(listItem);
    };

    return (
        <Paper>
            <Stack>
                <Header
                    event={event}
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
                    {listItems.map((item) =>
                        <Fragment key={item.id}>
                            <ReceiptItem item={item} />
                            <Divider />
                        </Fragment>
                    )}
                </List>

                {/* Footer */}
                <Box sx={{ px: 2, py: 1 }}>
                    <QuickAddBox handleListItem={handleAddedItem} />
                </Box>

                <Stack direction="row" spacing={1} sx={{ px: 2, py: 1 }}>
                    <Typography component="div">
                        Totaal van {eventId ?
                            <em>{eventName}</em>
                            : "items zonder event"}
                    </Typography>
                    <div style={{ flexGrow: 1 }}></div>
                    <Typography variant="h6" component="div" sx={{ whiteSpace: "nowrap" }}>
                        {formatEuro(eventTotal)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}

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

function Header({ event, onAddProduct, onAddAmount, onEdit }) {
    const formattedDate = isoToRelativeDate(event?.event_date);
    const participantIds = event?.event_participants;
    const eventName = event?.name;

    return (
        <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
            <Grid item>
                {event ?
                    <>
                        <Tooltip arrow title={
                            <Typography variant="caption" fontFamily="monospace">
                                ID: {event?.id}
                            </Typography>
                        }>
                            <Typography variant="h6" component="div">
                                {eventName}
                            </Typography>
                        </Tooltip>
                    </>
                    : <Typography variant="h6" component="div" fontStyle="italic">
                        Geen event
                    </Typography>
                }
            </Grid>

            {onEdit && event?.id &&
                <Grid item>
                    <IconButton size="small" onClick={onEdit}>
                        <Edit />
                    </IconButton>
                </Grid>}

            {formattedDate &&
                <Grid item>
                    <Chip label={formattedDate} variant="outlined" />
                </Grid>
            }

            {participantIds &&
                <Grid item>
                    <PersonAvatarGroup personIds={participantIds} />
                </Grid>
            }

            <Grid item>
                <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
                    <AddProductButton onClick={onAddProduct} />
                    <AddAmountButton onClick={onAddAmount} />
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}
