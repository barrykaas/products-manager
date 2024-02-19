import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';
import { useEventsInvalidator } from './EventsApiQueries';
import ControllerAppBar from '../Helpers/ControllerAppBar';


const defaultTitle = "Events";

export default function EventController({ handleSelectedEvent, onClose, title = defaultTitle }) {
    const [formOpen, setFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const invalidateEvents = useEventsInvalidator();

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

    const onRefresh = invalidateEvents;

    handleSelectedEvent = handleSelectedEvent ?? handleEditEvent;

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>
            <ControllerAppBar onClose={onClose} title={title} onRefresh={onRefresh} onAdd={handleAddEvent} />

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
