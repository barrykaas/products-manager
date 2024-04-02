import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import EventsList from './EventsList';
import { EventFormDialog } from './EventForm';
import { useEventsInvalidator } from './EventsApiQueries';
import ControllerView from '../Helpers/ControllerView';


const defaultTitle = "Events";

export default function EventController({ handleSelectedEvent, onClose, onMenu, title = defaultTitle } = {}) {
    const [formOpen, setFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

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

    const showEditButtons = Boolean(handleSelectedEvent);
    handleSelectedEvent = handleSelectedEvent ?? handleEditEvent;

    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>

            <ControllerView
                onClose={onClose}
                title={title}
                onRefresh={onRefresh}
                onAdd={handleAddEvent}
                onMenu={onMenu}
                initialSearch={searchQuery}
                handleNewSearch={setSearchQuery}
            >
                <EventsList
                    handleEditEvent={showEditButtons && handleEditEvent}
                    handleSelectedEvent={handleSelectedEvent}
                    searchQuery={searchQuery}
                />
            </ControllerView>

            <EventFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                initialValues={currentEvent}
                onSuccessfulCreateEdit={onSuccessfulCreateEdit}
            />
        </>
    );
}
