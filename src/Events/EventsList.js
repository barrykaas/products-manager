import { ListItemText, Divider, ListItemButton, IconButton, Stack } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';

import { useEvents } from "./EventsApiQueries";
import InfiniteList from "../Helpers/InfiniteList";
import { formatEuro } from "../Helpers/monetary";
import { isoToRelativeDate } from "../Helpers/dateTime";
import { PersonAvatarGroup } from "../Persons/Avatars";


function EventsListItem({ item, onEdit, onSelect }) {
    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    const listCount = item.lists.length;

    const secondaryInfo = [
        isoToRelativeDate(item.event_date),
        formatEuro(item.amount),
        `${listCount} lijst${listCount === 1 ? '' : 'en'}`,
    ];

    return (
        <ListItemButton
            onClick={onSelect}
            secondaryAction={secondaryAction}
            alignItems="flex-start" disablePadding
        >
            <Stack alignItems="flex-start">
                <ListItemText
                    primary={item.name}
                    secondary={secondaryInfo.filter(Boolean).join("  -  ")}
                />
                <PersonAvatarGroup personIds={item.event_participants} />
            </Stack>
        </ListItemButton>
    );
}

export default function EventsList({ handleEditEvent, handleSelectedEvent, searchQuery }) {
    const {
        data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        fetchNextPage
    } = useEvents({ params: { search: searchQuery } });

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
