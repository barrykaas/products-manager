import { List, ListItemButton } from "@mui/material";
import { EventCard } from "./EventCard";
import { Fragment } from "react";


export function EventsListItem({ event, onSelect }) {
    return (
        <ListItemButton
            divider
            onClick={() => onSelect(event)}
        >
            <EventCard
                event={event}
                showStats
            />
        </ListItemButton>
    );
}

export function EventsList({ events, onSelect, ...props }) {
    return (
        <List {...props}>
            {events.map((event) =>
                <Fragment key={event.id}>
                    <EventsListItem
                        event={event}
                        onSelect={onSelect}
                    />
                </Fragment>
            )}
        </List>
    );
}
