import { ListItem, ListItemText, Divider, ListItemButton, Skeleton, IconButton } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';

import { useEvents } from "./EventsApiQueries";
import { usePersons } from "../Persons/PersonsApiQueries";
import InfiniteList from "../Helpers/InfiniteList";
import { useListItems } from "../Lists/ListsApiQueries";
import { formatEuro } from "../Helpers/monetary";
import { isoToLocalDate } from "../Helpers/dateTime";


function EventsListItem({ item, onEdit, onSelect }) {
    const { isLoading, isError, data } = usePersons();
    const eventItemsQuery = useListItems({ eventId: item.id });

    if (isLoading || isError) {
        return <Skeleton />
    }

    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    const eventParticipantPersons = data.filter(person => item.event_participants.includes(person.id));

    const eventTotal = eventItemsQuery.data.reduce((s, i) => s + i.amount, 0);

    const secondaryInfo = [
        isoToLocalDate(item.event_date),
        formatEuro(eventTotal),
        eventParticipantPersons.map(p => p.name).join(', '),
    ];

    return (<ListItem alignItems="flex-start" secondaryAction={secondaryAction} disablePadding>
        <ListItemButton onClick={onSelect}>
            <ListItemText
                primary={item.name}
                secondary={secondaryInfo.join("  -  ")}
            />
        </ListItemButton>

    </ListItem>);
}

export default function EventsList({ handleEditEvent, handleSelectedEvent }) {
    const {
        data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        fetchNextPage
    } = useEvents();

    const allEvents = data?.pages.flatMap((page) => page.results) || [];

    return (
        <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
            isLoading={isFetching || isFetchingNextPage}
            error={isError ? error : null}
        >
            {allEvents.map((item) => (
                <Fragment key={item.id}>
                    <EventsListItem item={item}
                        onSelect={() => handleSelectedEvent(item)}
                        onEdit={() => handleEditEvent(item)} />
                    <Divider component="li" />
                </Fragment>
            ))}
        </InfiniteList>
    );
};
