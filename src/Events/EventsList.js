import { ListItem, Typography, ListItemText, Divider, ListItemButton, Skeleton, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useEvents } from "./EventsApiQueries";
import { getPersonsFn } from "../Persons/PersonsApiQueries";

import EditIcon from '@mui/icons-material/Edit';
import InfiniteList from "../Helpers/InfiniteList";


function EventsListItem({ item, onEdit, onSelect }) {
    const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

    function getDate() {
        const date = new Date(item.event_date);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }

    if (isLoading || isError) {
        return <Skeleton />
    }

    const secondaryAction = onEdit ?
        <IconButton aria-label="comment" onClick={onEdit}>
            <EditIcon />
        </IconButton>
        : null;

    const eventParticipantPersons = data.data.filter(person => item.event_participants.includes(person.id));

    return (<ListItem alignItems="flex-start" secondaryAction={secondaryAction} disablePadding>
        <ListItemButton onClick={onSelect}>
            <ListItemText
                primary={item.name}

                secondary={
                    <>
                        {/* <Stack direction="row" spacing={1}>
                        {eventParticipantPersons.map((person) => {
                            return <Chip color={"warning"} size="small" key={person.id} label={`${person.name}`} />
                        })}
                        <Chip size="small" label={getDate()} color="primary" />
                    </Stack> */}
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >{getDate()}</Typography>


                        {eventParticipantPersons.map((person, index) => {
                            return index === 0 ? " - " + person.name : `, ${person.name}`;
                        }).join('')}

                    </>
                }
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

    console.log("events data", data?.pages);
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
