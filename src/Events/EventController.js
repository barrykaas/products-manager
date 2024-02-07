import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import { EventAppBar, EventAppBarClosable } from './EventAppBar';
import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';


export default function EventController({ handleSelectedEvent, onClose }) {
    const [formOpen, setFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const handleAddEvent = () => {
        setFormOpen(true);
        setCurrentEvent({});
    };

    const handleEditEvent = (event) => {
        setFormOpen(true);
        setCurrentEvent(event);
    };

    const onSuccessfulCreateEdit = () => {
        setFormOpen(false);
        setMessageText("Gelukt!");
        setMessageState("success");
        setMessageOpen(true);
    };

    handleSelectedEvent = handleSelectedEvent ?? handleEditEvent;

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>
            {onClose ?
                <EventAppBarClosable onClose={onClose} title={"Events"} onAdd={handleAddEvent} /> :
                <EventAppBar title={"Events"} onAdd={handleAddEvent} />
            }

            <EventsList handleEditEvent={handleEditEvent} handleSelectedEvent={handleSelectedEvent} />

            <EventFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                initialValues={currentEvent}
                onSuccessfulCreateEdit={onSuccessfulCreateEdit}
            />
        </>
    );
}
