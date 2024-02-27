import { ListItemText, Divider, ListItemButton, IconButton, Stack, Typography } from "@mui/material";
import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';

import { useEvents } from "./EventsApiQueries";
import InfiniteList from "../Helpers/InfiniteList";
import { formatEuro } from "../Helpers/monetary";
import { isoToRelativeDate } from "../Helpers/dateTime";
import { PersonAvatarGroup } from "../Persons/Avatars";
import { Person } from "@mui/icons-material";


function EventsListItem({ item, onEdit, onSelect }) {
    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    const name = item.name;
    const listCount = item.lists.length;
    const participants = item.event_participants;
    const amount = item.amount;
    const amountPerPerson = participants.length >= 2 ?
        amount / participants.length
        : null;

    const secondaryInfo = [
        isoToRelativeDate(item.event_date),
        listCount === 0 ? null : `${listCount} lijst${listCount === 1 ? '' : 'en'}`,
    ];

    return (
        <ListItemButton
            onClick={onSelect}
            secondaryAction={secondaryAction}
            alignItems="flex-start" disablePadding
        >
            <Stack alignItems="flex-start" width={1}>
                <ListItemText
                    sx={{ width: 1 }}
                    primary={
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Typography>{name}</Typography>
                            {amount !== 0 &&
                                <Typography align="right" sx={{ whiteSpace: "nowrap" }}>
                                    <b>{formatEuro(amount)}</b>
                                </Typography>
                            }
                        </Stack>
                    }
                    secondary={
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                            {secondaryInfo.filter(Boolean).join("  -  ")}
                            {amount !== 0 && amountPerPerson &&
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Person fontSize="inherit" />
                                    <Typography variant="inherit" align="right" sx={{ whiteSpace: "nowrap" }}>
                                        {formatEuro(amountPerPerson)}
                                    </Typography>
                                </Stack>
                            }
                        </Stack>
                    }
                />
                <PersonAvatarGroup personIds={participants} />
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
