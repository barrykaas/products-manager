import { ListItem, ListItemAvatar, Typography, ListItemText, Divider, Avatar, List, ListItemButton, Skeleton, Chip, Stack, Button } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchEvents, getPersonsFn } from "./EventsApiQueries";

import AddIcon from '@mui/icons-material/Add';

function EventsListItem({ item, handleEdit }) {
    const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    const handleAddParticipant = () => {
        console.info('You clicked the add icon.');
        handleEdit(item);
    };

    function getDate() {
        const date = new Date(item.event_date);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }

    if (isLoading || isError) {
        return <Skeleton />
    }

    const eventParticipantPersonIds = item.event_participants.map((participant) => participant.participant);

    const eventParticipantPersons = data.data.filter(person => eventParticipantPersonIds.includes(person.id));

    

    return (<ListItem alignItems="flex-start">
        {/* <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar> */}

        <ListItemText
            primary={item.name}
            secondary={
                <>
                    <Stack direction="row" spacing={1}>
                        {eventParticipantPersons.map((person) => {
                            return <Chip size="small" key={person.id} label={`${person.name}`} onDelete={handleDelete} />
                        })}
                        <Chip size="small" icon={<AddIcon />} onClick={handleAddParticipant} label="Add" variant="outlined" color="success" />
                        <Chip size="small" label={getDate()} color="primary" />
                    </Stack>
                </>
            }
        />

    </ListItem>);
}

export default function EventsList({handleEdit}) {

    const {
        data,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
        getNextPageParam: (lastPage, pages) => lastPage['next'],
    })

    if (isFetching) {
        return <Skeleton />
    }

    const eventsdata = data.pages.flatMap((page) => (page.results));

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {eventsdata.map((item) => (
                    <React.Fragment key={item.id}>
                        <EventsListItem item={item} handleEdit={handleEdit} />
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        </>
    );
};