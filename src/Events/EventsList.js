import { ListItem, ListItemAvatar, Typography, ListItemText, Divider, Avatar, List, ListItemButton, Skeleton, Chip, Stack, Button, IconButton } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchEvents, getPersonsFn } from "./EventsApiQueries";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';


function EventsListItem({ item, handleEdit, handleSelectedEvent }) {
    const { isLoading, isError, data, error } = useQuery({ queryKey: ['persons'], queryFn: getPersonsFn })

    function getDate() {
        const date = new Date(item.event_date);
        const formattedDate = date.toLocaleDateString();
        return formattedDate
    }

    if (isLoading || isError) {
        return <Skeleton />
    }

    const eventParticipantPersons = data.data.filter(person => item.event_participants.includes(person.id));

    return (<ListItem alignItems="flex-start" secondaryAction={
        <IconButton aria-label="comment" onClick={() => handleEdit(item)}>
          <EditIcon/>
        </IconButton>
      } disablePadding>
        <ListItemButton onClick={handleSelectedEvent}>
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

export default function EventsList({ handleEdit, handleSelectedEvent }) {

    const {
        data,
        isFetching,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
        getNextPageParam: (lastPage, pages) => lastPage['next'],
    })

    console.log("data", data);

    if (isError) {
        console.log(error);
        return <Skeleton />
    }

    if (isFetching) {
        return <Skeleton />
    }

    const eventsdata = data.pages.flatMap((page) => (page.results));

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {eventsdata.map((item) => (
                    <React.Fragment key={item.id}>
                        <EventsListItem item={item} handleEdit={handleEdit} handleSelectedEvent={() => handleSelectedEvent(item)} />
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        </>
    );
};