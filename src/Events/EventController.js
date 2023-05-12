import React, { useState } from 'react';
import { Typography, Paper, Container, Box, Alert, Snackbar } from '@mui/material';
import EventAppBar from './EventAppBar';
import EventsList from './EventsList';
import ParticipantsPicker from './ParticipantsController';
// import ProductsForm from '../Products/ProductsForm';

//import ButtonAppBar from './MyAppBar'

function EventController() {

    const [currentEvent, setCurrentEvent] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const [messageOpen, setMessageOpen] = useState(false);

    const [messageText, setMessageText] = useState("");
    const [messageState, setMessageState] = useState(true);


    const handleEditParticipants = (event) => {
        setCurrentEvent(event);
        setPickerOpen(true);
    };

    //handleEditParticipants("gfhweiuhui");

    const handleEditorClose = (message, isSuccess) => {
        setPickerOpen(false);
        setCurrentEvent(null);
        setMessageOpen(true);
        setMessageText(message);
        setMessageState(isSuccess);
    };


    return (
        <>
            <Snackbar open={messageOpen} autoHideDuration={1500} onClose={() => setMessageOpen(false)}>
                <Alert severity={messageState ? "success" : "error"} sx={{ width: '100%' }}>
                    {messageText}
                </Alert>
            </Snackbar>
            <EventAppBar />
            <EventsList handleEdit={handleEditParticipants} />
            {pickerOpen ? <ParticipantsPicker open={pickerOpen} event={currentEvent} handleEditorClose={handleEditorClose} /> : <></>}


        </>
    );
}

export default EventController;
